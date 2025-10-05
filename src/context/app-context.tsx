'use client';

import type { AppData, UserProfile, FoodLogItem, WaterLog } from '@/lib/types';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AppContextType {
  data: AppData | null;
  loading: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addFoodLog: (log: FoodLogItem) => void;
  addWater: (date: string) => void;
  getWaterForDate: (date: string) => number;
  getCaloriesForDate: (date: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const APP_DATA_KEY = 'calorie-companion-data';

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(APP_DATA_KEY);
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        setData({ user: null, foodLog: [], waterLog: [] });
      }
    } catch (error) {
      console.error('Failed to parse data from localStorage', error);
      setData({ user: null, foodLog: [], waterLog: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && data) {
      localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
    }
  }, [data, loading]);

  const login = useCallback((user: UserProfile) => {
    setData((prev) => ({
      ...prev!,
      user,
    }));
  }, []);

  const logout = useCallback(() => {
    setData({ user: null, foodLog: [], waterLog: [] });
    // Keep the logs for demo purposes, but in a real app you might clear them
    // localStorage.removeItem(APP_DATA_KEY);
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setData((prev) => {
      if (!prev?.user) return prev;
      return {
        ...prev,
        user: { ...prev.user, ...profile },
      };
    });
  }, []);

  const addFoodLog = useCallback((log: FoodLogItem) => {
    setData((prev) => ({
      ...prev!,
      foodLog: [log, ...prev!.foodLog],
    }));
  }, []);
  
  const getWaterForDate = useCallback((date: string): number => {
      if (!data) return 0;
      const waterEntry = data.waterLog.find((entry) => entry.date === date);
      return waterEntry ? waterEntry.glasses : 0;
  }, [data]);

  const addWater = useCallback((date: string) => {
    setData((prevData) => {
        if (!prevData) return null;

        const existingEntryIndex = prevData.waterLog.findIndex((entry) => entry.date === date);

        if (existingEntryIndex > -1) {
            const newWaterLog = [...prevData.waterLog];
            newWaterLog[existingEntryIndex] = {
                ...newWaterLog[existingEntryIndex],
                glasses: newWaterLog[existingEntryIndex].glasses + 1,
            };
            return { ...prevData, waterLog: newWaterLog };
        } else {
            const newWaterLog = [...prevData.waterLog, { date, glasses: 1 }];
            return { ...prevData, waterLog: newWaterLog };
        }
    });
  }, []);

  const getCaloriesForDate = useCallback((date: string): number => {
    if (!data) return 0;
    return data.foodLog
      .filter(log => new Date(log.date).toISOString().startsWith(date))
      .reduce((total, log) => total + log.totalCalories, 0);
  }, [data]);


  return (
    <AppContext.Provider value={{ data, loading, login, logout, updateProfile, addFoodLog, addWater, getWaterForDate, getCaloriesForDate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
