"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";

// 충전소 타입 정의
export interface ChargingStation {
  id: string;
  name: string;
  location: string;
  chargers: number;
  status: "active" | "maintenance" | "disabled";
}

// 설정 타입 정의
interface Settings {
  theme: "light" | "dark" | "system";
  fontSize: number;
  colorTheme: "default" | "sejong" | "blue" | "green";
  stations: ChargingStation[];
}

// 기본 설정값
const defaultSettings: Settings = {
  theme: "system",
  fontSize: 16,
  colorTheme: "default",
  stations: [
    {
      id: "station1",
      name: "세종대학교 정문 충전소",
      location: "서울특별시 광진구 능동로 209",
      chargers: 4,
      status: "active",
    },
    {
      id: "station2",
      name: "세종대학교 후문 충전소",
      location: "서울특별시 광진구 능동로 178",
      chargers: 2,
      status: "active",
    },
  ],
};

// 컨텍스트 타입 정의
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  addStation: (station: ChargingStation) => void;
  updateStation: (id: string, station: Partial<ChargingStation>) => void;
  deleteStation: (id: string) => void;
}

// 컨텍스트 생성
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// 컨텍스트 프로바이더 컴포넌트
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  // localStorage에서 설정 불러오기
  useEffect(() => {
    // 서버 사이드 렌더링 중에는 localStorage 접근 방지
    if (typeof window === "undefined") return;

    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        setTheme(parsedSettings.theme);
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
    setLoaded(true);
  }, [setTheme]);

  // 설정 업데이트
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== "undefined") {
        localStorage.setItem("settings", JSON.stringify(updated));
      }
      return updated;
    });

    // 테마 변경 시 next-themes 업데이트
    if (newSettings.theme) {
      setTheme(newSettings.theme);
    }
  };

  // 설정 초기화
  const resetSettings = () => {
    setSettings(defaultSettings);
    setTheme(defaultSettings.theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
    }
  };

  // 충전소 추가
  const addStation = (station: ChargingStation) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        stations: [...prev.stations, station],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("settings", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // 충전소 업데이트
  const updateStation = (id: string, station: Partial<ChargingStation>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        stations: prev.stations.map((s) =>
          s.id === id ? { ...s, ...station } : s
        ),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("settings", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // 충전소 삭제
  const deleteStation = (id: string) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        stations: prev.stations.filter((s) => s.id !== id),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("settings", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // 폰트 크기 적용
  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      document.documentElement.style.fontSize = `${settings.fontSize}px`;
    }
  }, [settings.fontSize, loaded]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        addStation,
        updateStation,
        deleteStation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// 커스텀 훅
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
