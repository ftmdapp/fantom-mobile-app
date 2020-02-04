import React, { useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  BackHandler,
  Platform,
  NativeModules
} from "react-native";
import { Messages } from "../../../theme";
import styles from "./styles";
import { FantomLogo } from "../../../images";
import { NavigationService, routes } from "~/navigation/helpers";
import { connect } from "react-redux";
import { setMylanguage } from "../../../theme";
import DeviceInfo from "react-native-device-info";
import { getAppStoreVersion } from "../../../utils/converts";
import { setDopdownAlert as setDopdownAlertAction } from "../../../redux/notification/actions";

const WalletSetup = (props: any) => {
  const onCreateNewWallet = () => {
    NavigationService.navigate(routes.root.BackupWallet);
  };
  const onRestoreWallet = () => {
    NavigationService.navigate(routes.root.RecoverWallet);
  };
  const backAndroidPress = () => {
    BackHandler.exitApp();
  };
  useEffect(() => {
    const { language, setDopdownAlert } = props;
    const version = DeviceInfo.getVersion();

    getAppStoreVersion().then(result => {
      if (result && result.version) {
        if (result && result.version && result.version !== version) {
          setDopdownAlert("custom", Messages.updateNow, true);
        }
      }
    });

    if (language && language.selectedLanguage) {
      setMylanguage(language.selectedLanguage);
    } else if (language && language.selectedLanguage === "") {
      if (Platform.OS === "ios") {
        const locale = NativeModules.SettingsManager.settings.AppleLocale;
        if (locale.includes("ko")) setMylanguage("ko");
        else if (locale.includes("zh")) setMylanguage("zh-Hans");
        else setMylanguage("en");
      }

      if (Platform.OS === "android") {
        const locale1 = NativeModules.I18nManager.localeIdentifier; // "fr_FR"
        if (locale1.includes("ko")) setMylanguage("ko");
        else if (locale1.includes("zh")) setMylanguage("zh-Hans");
        else setMylanguage("en");
      }
    }
  }, []);
  useEffect(() => {
    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAndroidPress
    );
    return () => handler.remove();
  });
  return (
    <ImageBackground
      style={styles.imageBackground}
      source={require("../../../images/background.png")}
      imageStyle={{ resizeMode: "cover" }}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.fantomText}>fantom</Text>
        </View>
        <View style={styles.subHeaderContainer}>
          <Image
            source={FantomLogo}
            style={styles.fantomLogo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          style={styles.walletSetup}
          onPress={() => onCreateNewWallet()}
        >
          <Text style={styles.walletSetupText}>{Messages.createWallet}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recoverWalletStyle}
          onPress={() => onRestoreWallet()}
        >
          <Text style={styles.footerText1}>{Messages.alreadyWallet}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const mapStateToProps = state => ({
  language: state.selectedLanguage
});
const mapDispatchToProps = {
  setDopdownAlert: setDopdownAlertAction
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletSetup);
