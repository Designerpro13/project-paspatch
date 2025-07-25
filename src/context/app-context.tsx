
// src/context/app-context.tsx
"use client";

import { PrioritizePatchesOutput } from "@/ai/flows/prioritize-patches";
import { ParseNmapServiceScanOutput } from "@/ai/flows/parse-nmap-service-scan";
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import {v4 as uuidv4} from 'uuid';

type Vulnerability = {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  [key: string]: any;
}

type Asset = ParseNmapServiceScanOutput['services'][0];
export type Patch = PrioritizePatchesOutput[0] & {id: string};

const DEMO_VULNERABILITIES: Vulnerability[] = [
    { id: "CVE-2023-50164", severity: "High" },
    { id: "CVE-2023-3390", severity: "Critical" },
    { id: "CVE-2024-1234", severity: "Medium" },
];

const DEMO_ASSETS: Asset[] = [
    { port: 22, protocol: 'tcp', serviceName: 'OpenSSH', serviceVersion: '8.2p1', state: 'open' },
    { port: 80, protocol: 'tcp', serviceName: 'Apache httpd', serviceVersion: '2.4.41', state: 'open' },
    { port: 443, protocol: 'tcp', serviceName: 'Nginx', serviceVersion: '1.18.0', state: 'open' },
];

const DEMO_PATCHES: Patch[] = [
    { id: uuidv4(), priority: 'Critical', service: 'Apache Struts', currentVersion: '2.5.32', recommendedPatch: 'Upgrade to 2.5.33', rationale: 'Addresses RCE vulnerability CVE-2023-50164.'},
    { id: uuidv4(), priority: 'High', service: 'OpenSSH', currentVersion: '8.2p1', recommendedPatch: 'Upgrade to 9.7p1', rationale: 'Fixes multiple security flaws.'},
    { id: uuidv4(), priority: 'Medium', service: 'Nginx', currentVersion: '1.18.0', recommendedPatch: 'Upgrade to 1.25.3', rationale: 'Includes several bug fixes and performance improvements.'},
];


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
  addPatches: (newPatches: Omit<Patch, 'id'>[]) => void;
  createPatch: (patch: Omit<Patch, 'id'>) => void;
  updatePatch: (updatedPatch: Patch) => void;
  deletePatch: (patchId: string) => void;
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

  useEffect(() => {
    if (isDemoMode) {
      setVulnerabilities(DEMO_VULNERABILITIES);
      setAssets(DEMO_ASSETS);
      setPatches(DEMO_PATCHES);
    } else {
      setVulnerabilities([]);
      setAssets([]);
      setPatches([]);
    }
  }, [isDemoMode]);

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

  const addPatches = (newPatches: Omit<Patch, 'id'>[]) => {
    const patchesWithIds: Patch[] = newPatches.map(p => ({...p, id: uuidv4()}));
    setPatches(prev => [...prev, ...patchesWithIds]);
  }
  
  const createPatch = (patch: Omit<Patch, 'id'>) => {
    const newPatch: Patch = {...patch, id: uuidv4()};
    setPatches(prev => [newPatch, ...prev]);
  }

  const updatePatch = (updatedPatch: Patch) => {
    setPatches(prev => prev.map(p => p.id === updatedPatch.id ? updatedPatch : p));
  }

  const deletePatch = (patchId: string) => {
    setPatches(prev => prev.filter(p => p.id !== patchId));
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
      patchesApplied: patches.filter(p => p.priority !== 'Critical' && p.priority !== 'High').length,
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
        createPatch,
        updatePatch,
        deletePatch
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
