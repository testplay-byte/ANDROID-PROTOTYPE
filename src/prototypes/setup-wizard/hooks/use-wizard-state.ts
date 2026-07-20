/**
 * setup-wizard / hooks / use-wizard-state — wizard step management.
 *
 * Manages the current step (0-6), theme mode, selected palette,
 * and folder/backup mock state. Provides next/back/reset functions.
 *
 * Folder selection + confirmation are merged into a single step (step 2),
 * so the wizard now has 7 steps total instead of 8.
 */
import { useState, useCallback } from "react";
import type { ThemeMode, ThemePalette } from "../lib/themes";
import { DEFAULT_PALETTE } from "../lib/themes";
import type { CharacterConfig } from "../components/character/types";
import { DEFAULT_CHARACTER } from "../components/character/types";

export interface WizardState {
  step: number;
  themeMode: ThemeMode;
  palette: ThemePalette;
  folderSelected: boolean;
  backupSelected: boolean;
  permissionsGranted: {
    installApps: boolean;
    notifications: boolean;
    battery: boolean;
  };
  character: CharacterConfig;
}

export const TOTAL_STEPS = 8;

export function useWizardState() {
  const [step, setStep] = useState(0);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [palette, setPalette] = useState<ThemePalette>(DEFAULT_PALETTE);
  const [folderSelected, setFolderSelected] = useState(false);
  const [backupSelected, setBackupSelected] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState({
    installApps: false,
    notifications: false,
    battery: false,
  });
  const [character, setCharacter] = useState<CharacterConfig>(DEFAULT_CHARACTER);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setThemeMode("dark");
    setPalette(DEFAULT_PALETTE);
    setFolderSelected(false);
    setBackupSelected(false);
    setPermissionsGranted({ installApps: false, notifications: false, battery: false });
    setCharacter(DEFAULT_CHARACTER);
  }, []);

  const togglePermission = useCallback((key: keyof typeof permissionsGranted) => {
    setPermissionsGranted((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return {
    step,
    themeMode,
    setThemeMode,
    palette,
    setPalette,
    folderSelected,
    setFolderSelected,
    backupSelected,
    setBackupSelected,
    permissionsGranted,
    togglePermission,
    character,
    setCharacter,
    next,
    back,
    reset,
  };
}
