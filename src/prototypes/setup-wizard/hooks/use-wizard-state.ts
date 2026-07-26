import { useState, useCallback } from "react";
import type { ThemeMode, ThemePalette } from "../lib/themes";
import { DEFAULT_PALETTE } from "../lib/themes";

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
  /** Linked anime state (for the restore flow). */
  linkedAnime: LinkedAnime[];
}

/**
 * An anime entry being linked during the restore flow.
 * - `linked: true` + `matchedName` → successfully linked to an AniList entry
 * - `linked: false` → no match found (shown in manual linking screen)
 */
export interface LinkedAnime {
  id: number;
  /** The name from the backup file. */
  backupName: string;
  /** Whether a match was found. */
  linked: boolean;
  /** The matched AniList name (if linked). */
  matchedName?: string;
}

/**
 * Wizard step indices.
 *
 *   0  Welcome
 *   1  Theme
 *   2  Folder
 *   3  Permissions
 *   4  Restore (Select backup file)
 *   5  Format not supported (fun screen)
 *   6  Processing backup (~2s animation)
 *   7  Backup summary (stats + manga warning + Cancel/Restore)
 *   8  Linking anime (stats + linked/unlinked list)
 *   9  Manual linking (unlinked anime → search → link)
 *   10 Restore summary (final summary → Restore)
 *   11 Restore successful (auto-close 5s or Continue)
 *   12 Finish (URL set screen)
 */
export const TOTAL_STEPS = 13;

/** Mock anime entries for the linking flow. */
const MOCK_ANIME_ENTRIES: LinkedAnime[] = [
  { id: 1, backupName: "Frieren: Beyond Journey's End", linked: true, matchedName: "Sousou no Frieren" },
  { id: 2, backupName: "Jujutsu Kaisen Season 2", linked: true, matchedName: "Jujutsu Kaisen 2nd Season" },
  { id: 3, backupName: "Demon Slayer: Hashira Training", linked: false },
  { id: 4, backupName: "Attack on Titan Final", linked: true, matchedName: "Shingeki no Kyojin: The Final Season" },
  { id: 5, backupName: "Spy x Family Code: White", linked: false },
  { id: 6, backupName: "Chainsaw Man", linked: true, matchedName: "Chainsaw Man" },
  { id: 7, backupName: "One Piece Egghead Arc", linked: false },
  { id: 8, backupName: "Solo Leveling", linked: true, matchedName: "Ore dake Level Up na Ken" },
];

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
  const [linkedAnime, setLinkedAnime] = useState<LinkedAnime[]>(MOCK_ANIME_ENTRIES);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  /**
   * Jump directly to the Finish screen (last step), skipping the entire
   * restore flow. Used by the Restore screen's "Skip" button so that
   * skipping a backup bypasses all restore-related screens.
   */
  const skipToFinish = useCallback(() => {
    setStep(TOTAL_STEPS - 1);
  }, []);

  /** Jump to a specific step (used for the restore sub-flow navigation). */
  const goToStep = useCallback((target: number) => {
    setStep(Math.max(0, Math.min(target, TOTAL_STEPS - 1)));
  }, []);

  /**
   * Link an unlinked anime to a matched AniList entry.
   * Removes it from the manual linking list.
   */
  const linkAnime = useCallback((id: number, matchedName: string) => {
    setLinkedAnime((prev) =>
      prev.map((a) => (a.id === id ? { ...a, linked: true, matchedName } : a)),
    );
  }, []);

  /** Reset the entire wizard to the initial state. */
  const reset = useCallback(() => {
    setStep(0);
    setThemeMode("dark");
    setPalette(DEFAULT_PALETTE);
    setFolderSelected(false);
    setBackupSelected(false);
    setPermissionsGranted({ installApps: false, notifications: false, battery: false });
    setLinkedAnime(MOCK_ANIME_ENTRIES);
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
    linkedAnime,
    linkAnime,
    next,
    back,
    skipToFinish,
    goToStep,
    reset,
  };
}
