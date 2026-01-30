import { ScanResult } from "../types";

const STORAGE_KEY = "letsdog_scans";

export const saveScan = (scan: ScanResult): void => {
  const existingScans = getScans();
  // Limit to last 50 to save space
  const updatedScans = { ...existingScans, [scan.id]: scan };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScans));
};

export const getScans = (): Record<string, ScanResult> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getScanById = (id: string): ScanResult | null => {
  const scans = getScans();
  return scans[id] || null;
};

export const generateId = (): string => {
  // Simple 3 digit ID generation
  let id = "";
  do {
    id = Math.floor(Math.random() * 900 + 100).toString();
  } while (getScanById(id) !== null); // Ensure uniqueness locally
  return id;
};