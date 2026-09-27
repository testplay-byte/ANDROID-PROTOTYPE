/**
 * proto-kit — shared design-system components for all prototypes.
 *
 * Import from a prototype:
 *   import { DeviceFrame, Screen, BottomNav, Stage } from "@/proto-kit";
 *   import "@/proto-kit/tokens/tokens.css";
 */

export { DeviceFrame, Screen, type DeviceFrameProps } from "./device-frame/device-frame";
export { StatusBar } from "./device-frame/status-bar";

// Device chrome settings — configurable camera cutout (punch / pill / notch),
// its position and pill size. Set from the dashboard Settings page
// (app/settings/); read + applied by <StatusBar> on every prototype device.
export {
  useDeviceSettings,
  loadDeviceSettings,
  saveDeviceSettings,
} from "./device-settings/store";
export {
  DEVICE_SETTINGS_KEY,
  DEFAULT_DEVICE_SETTINGS,
  type DeviceSettings,
  type CutoutType,
  type CutoutPosition,
  type PillSize,
} from "./device-settings/types";
export { BottomNav, type NavItem, type BottomNavProps, type BottomNavVariant } from "./bottom-nav/bottom-nav";
export { TopBar, type TopBarProps, type TopBarVariant } from "./top-bar/top-bar";
export {
  Stage,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  type StageProps,
} from "./stage/stage";
export { DeviceThemeProvider, useDeviceTheme } from "./theme/theme-provider";
export type { AppTheme, ThemeProviderProps } from "./theme/types";
export {
  DEVICE_STYLES,
  STYLE_LABELS,
  type DeviceStyle,
} from "./styles/types";

// Swipe gestures — permanent proto-kit feature. Every prototype wires it
// up in its page.tsx with its own screen order + navigation callbacks.
export { useSwipeSimulation, type SwipeSimulationOptions } from "./swipe-simulation/use-swipe-simulation";

// On-screen keyboard — replaces the native soft keyboard. Every prototype
// wraps with <KeyboardProvider> and renders <Keyboard /> inside DeviceFrame.
export { KeyboardProvider, useKeyboard, useKeyboardInput, type KeyboardTarget, type KeyboardProviderProps } from "./keyboard/keyboard-context";
export { Keyboard } from "./keyboard/keyboard";
