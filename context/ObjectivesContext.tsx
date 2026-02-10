import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type DayStatus = "success" | "fail" | null;

export interface Objective {
  id: string;
  name: string;
  durationDays: number;
  startDate: string; // ISO date string
  dailyStatus: Record<string, DayStatus>; // date string -> status
}

type ObjectivesContextType = {
  objectives: Objective[];
  addObjective: (name: string, durationDays: number) => Promise<void>;
  updateDayStatus: (
    objectiveId: string,
    date: string,
    status: DayStatus,
  ) => Promise<void>;
  deleteObjective: (objectiveId: string) => Promise<void>;
  getOverallPercentage: () => number;
  getTodayStatus: (objectiveId: string) => DayStatus;
};

const STORAGE_KEY = "@objectives_app";

const ObjectivesContext = createContext<ObjectivesContextType | undefined>(
  undefined,
);

/** Formate une date en YYYY-MM-DD en heure locale (évite les bugs de timezone) */
export function formatDateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatDateToKey(new Date());
}

export function ObjectivesProvider({ children }: { children: ReactNode }) {
  const [objectives, setObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    const loadObjectives = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setObjectives(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Erreur chargement objectifs:", e);
      }
    };
    loadObjectives();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
  }, [objectives]);

  const addObjective = useCallback(
    async (name: string, durationDays: number) => {
      const newObjective: Objective = {
        id: Date.now().toString(),
        name,
        durationDays,
        startDate: getTodayDateString(),
        dailyStatus: {},
      };
      setObjectives((prev) => [...prev, newObjective]);
    },
    [],
  );

  const updateDayStatus = useCallback(
    async (objectiveId: string, date: string, status: DayStatus) => {
      setObjectives((prev) =>
        prev.map((obj) =>
          obj.id === objectiveId
            ? {
                ...obj,
                dailyStatus: {
                  ...obj.dailyStatus,
                  [date]: status,
                },
              }
            : obj,
        ),
      );
    },
    [],
  );

  const deleteObjective = useCallback(async (objectiveId: string) => {
    setObjectives((prev) => prev.filter((obj) => obj.id !== objectiveId));
  }, []);

  const getOverallPercentage = useCallback(() => {
    let totalDays = 0;
    let successDays = 0;
    objectives.forEach((obj) => {
      const daysInRange = getDaysInRange(obj.startDate, obj.durationDays);
      daysInRange.forEach((dateStr) => {
        totalDays++;
        if (obj.dailyStatus[dateStr] === "success") successDays++;
      });
    });
    if (totalDays === 0) return 0;
    return Math.round((successDays / totalDays) * 100);
  }, [objectives]);

  const getTodayStatus = useCallback(
    (objectiveId: string): DayStatus => {
      const obj = objectives.find((o) => o.id === objectiveId);
      if (!obj) return null;
      const today = getTodayDateString();
      return obj.dailyStatus[today] ?? null;
    },
    [objectives],
  );

  return (
    <ObjectivesContext.Provider
      value={{
        objectives,
        addObjective,
        updateDayStatus,
        deleteObjective,
        getOverallPercentage,
        getTodayStatus,
      }}
    >
      {children}
    </ObjectivesContext.Provider>
  );
}

export function useObjectives() {
  const context = useContext(ObjectivesContext);
  if (!context)
    throw new Error("useObjectives must be used within ObjectivesProvider");
  return context;
}

export function getDaysInRange(
  startDateStr: string,
  durationDays: number,
): string[] {
  const dates: string[] = [];
  // Parser la date en local pour éviter les décalages timezone
  const [year, month, day] = startDateStr.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < durationDays; i++) {
    const d = new Date(year, month - 1, day + i);
    d.setHours(0, 0, 0, 0);
    if (d <= today) {
      dates.push(formatDateToKey(d));
    }
  }
  return dates;
}

export function getObjectiveProgress(obj: Objective): {
  success: number;
  total: number;
  percentage: number;
} {
  const daysInRange = getDaysInRange(obj.startDate, obj.durationDays);
  let success = 0;
  daysInRange.forEach((dateStr) => {
    if (obj.dailyStatus[dateStr] === "success") success++;
  });
  const total = daysInRange.length;
  const percentage = total > 0 ? Math.round((success / total) * 100) : 0;
  return { success, total, percentage };
}
