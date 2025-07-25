// src/context/app-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const DEMO_DATA = {
  totalVulnerabilities: 1234,
  criticalIssues: 89,
  patchesApplied: 573,
  assetsMonitored: 2450,
  vulnerabilityChartData: [
    { severity: "Low", count: 186 },
    { severity: "Medium", count: 305 },
    { severity: "High", count: 237 },
    { severity: "Critical", count: 89 },
  ],
};

const ACTUAL_DATA = {
  totalVulnerabilities: 0,
  criticalIssues: 0,
  patchesApplied: 0,
  assetsMonitored: 0,
  vulnerabilityChartData: [
    { severity: "Low", count: 0 },
    { severity: "Medium", count: 0 },
    { severity: "High", count: 0 },
    { severity: "Critical", count: 0 },
  ],
};

interface AppContextType {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  dashboardData: typeof DEMO_DATA;
  isLoading: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  toggleDemoMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("patchwise_auth");
      if (storedAuth) {
        setIsAuthenticated(JSON.parse(storedAuth));
      }
      const storedDemoMode = localStorage.getItem("patchwise_demo_mode");
      if (storedDemoMode) {
        setIsDemoMode(JSON.parse(storedDemoMode));
      }
    } catch (error) {
        console.error("Could not read from local storage", error)
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = (user: string, pass: string) => {
    if (user === "admin" && pass === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("patchwise_auth", JSON.stringify(true));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("patchwise_auth");
  };

  const toggleDemoMode = () => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    localStorage.setItem("patchwise_demo_mode", JSON.stringify(newMode));
  };
  
  const dashboardData = isDemoMode ? DEMO_DATA : ACTUAL_DATA;

  return (
    <AppContext.Provider value={{ 
        isAuthenticated, 
        isDemoMode,
        dashboardData,
        isLoading,
        login, 
        logout,
        toggleDemoMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
