import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Vérifie si l'app tourne dans Expo Go.
 * Les notifications ne fonctionnent pas sur Android dans Expo Go (SDK 53+).
 */
export function isExpoGo(): boolean {
  return Constants.appOwnership === "expo";
}

/**
 * Vérifie si les notifications sont supportées sur cette plateforme.
 * Retourne false sur Android dans Expo Go.
 */
export function areNotificationsSupported(): boolean {
  if (Platform.OS === "android" && isExpoGo()) {
    return false;
  }
  return true;
}
