
// src/context/app-context.tsx
"use client";

import { PrioritizePatchesOutput } from "@/ai/flows/prioritize-patches";
import { ParseNmapServiceScanOutput } from "@/ai/flows/parse-nmap-service-scan";
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

type Vulnerability = {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  [key: string]: any;
}

type Asset = ParseNmapServiceScanOutput['services'][0];
type Patch = PrioritizePatchesOutput[0];

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

const ACTUAL_DATA_TEMPLATE = {
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
  vulnerabilities: Vulnerability[];
  assets: Asset[];
  patches: Patch[];
  isLoading: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  toggleDemoMode: () => void;
  addVulnerabilities: (newVulnerabilities: Vulnerability[]) => void;
  addAssets: (newAssets: Asset[]) => void;
  addPatches: (newPatches: Patch[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [patches, setPatches] = useState<Patch[]>([]);


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
  
  const addVulnerabilities = (newVulnerabilities: Vulnerability[]) => {
    setVulnerabilities(prev => [...prev, ...newVulnerabilities]);
  }
  
  const addAssets = (newAssets: Asset[]) => {
    setAssets(prev => [...prev, ...newAssets]);
  }

  const addPatches = (newPatches: Patch[]) => {
    setPatches(prev => [...prev, ...newPatches]);
  }

  const actualData = useMemo(() => {
    const severities = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    vulnerabilities.forEach(vuln => {
      if (severities[vuln.severity] !== undefined) {
        severities[vuln.severity]++;
      }
    });

    return {
      totalVulnerabilities: vulnerabilities.length,
      criticalIssues: severities.Critical,
      patchesApplied: patches.length,
      assetsMonitored: assets.length,
      vulnerabilityChartData: [
        { severity: "Low", count: severities.Low },
        { severity: "Medium", count: severities.Medium },
        { severity: "High", count: severities.High },
        { severity: "Critical", count: severities.Critical },
      ],
    }
  }, [vulnerabilities, assets, patches])
  
  const dashboardData = isDemoMode ? DEMO_DATA : actualData;

  return (
    <AppContext.Provider value={{ 
        isAuthenticated, 
        isDemoMode,
        dashboardData,
        vulnerabilities,
        assets,
        patches,
        isLoading,
        login, 
        logout,
        toggleDemoMode,
        addVulnerabilities,
        addAssets,
        addPatches,
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
