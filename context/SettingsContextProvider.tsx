import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  cancelAllMotivationalNotifications,
  scheduleMotivationalNotifications,
} from "../utils/notificationService";
import type { Objective } from "./ObjectivesContext";

type SettingProps = {
  children: ReactNode;
};

type SettingsContextType = {
  dailyMotivation: boolean;
  motivationalNotifications: boolean;
  toggleDailyMotivation: () => Promise<void>;
  toggleMotivationalNotifications: (objectives: Objective[]) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: SettingProps) {
  const [dailyMotivation, setDailyMotivation] = useState<boolean>(false);
  const [motivationalNotifications, setMotivationalNotifications] =
    useState<boolean>(false);

  useEffect(() => {
    const loadSettings = async () => {
      const savedMotivation = await AsyncStorage.getItem("dailyMotivation");
      if (savedMotivation !== null) {
        setDailyMotivation(savedMotivation === "true");
      }

      const savedNotifications = await AsyncStorage.getItem(
        "motivationalNotifications",
      );
      if (savedNotifications !== null) {
        const isEnabled = savedNotifications === "true";
        setMotivationalNotifications(isEnabled);
      }
    };
    loadSettings();
  }, []);

  const toggleDailyMotivation = async () => {
    const newValue = !dailyMotivation;
    setDailyMotivation(newValue);
    await AsyncStorage.setItem("dailyMotivation", String(newValue));
  };

  const toggleMotivationalNotifications = useCallback(
    async (objectives: Objective[]) => {
      const newValue = !motivationalNotifications;
      setMotivationalNotifications(newValue);
      await AsyncStorage.setItem("motivationalNotifications", String(newValue));

      if (newValue) {
        await scheduleMotivationalNotifications(objectives);
      } else {
        await cancelAllMotivationalNotifications();
      }
    },
    [motivationalNotifications],
  );

  return (
    <SettingsContext.Provider
      value={{
        dailyMotivation,
        motivationalNotifications,
        toggleDailyMotivation,
        toggleMotivationalNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
