import { Shade } from "../fonts/FontConfig";

export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export interface AppTheme {
  mode: ThemeMode;
  primary01(shade: Shade): string;

  secondary01(shade: Shade): string;

  background01(shade: Shade): string;
  background02(shade: Shade): string;

  light: string;
  dark: string;

  negative(shade: Shade): string;
  positive(shade: Shade): string;

  text01(shade: Shade): string;
  text02(shade: Shade): string;

  button01(shade: Shade): string;
  button02(shade: Shade): string;

  greenDotMid?: string;
  greenDotOut?: string;
}
