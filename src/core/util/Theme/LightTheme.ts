import { AppTheme, ThemeMode } from './Theme';
import { Shade } from '../fonts/FontConfig';

export const LightTheme: AppTheme = {
  // overall neutrals
  light: '#0C1219',
  dark: '#FFFFFF',
  mode: ThemeMode.LIGHT,
  // Primary: bright brand blue used for CTA buttons in screenshots
  // Primary: use base color #005486 and provide light/dark variants
  primary01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      // allow explicit custom alpha
      return `rgba(0, 84, 134, ${shade.custom})`;
    }

    const baseRgb = { r: 0, g: 84, b: 134 }; // #005486
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 125:
        // slightly darker variant
        return '#00476f';
      case 100:
        return '#005486'; // base primary
      case 75:
        return toRgba(0.75);
      case 50:
        return toRgba(0.5);
      case 25:
        return toRgba(0.25);
      default:
        if (typeof shade === 'number') {
          const alpha = Math.max(0, Math.min(1, shade / 100));
          return toRgba(alpha);
        }
        return toRgba(1);
    }
  },

  // Background tones: include a soft cream/top accent and white surfaces
  background01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(246, 239, 216, ${shade.custom})`;
    }
    // Base surface color for background01
    const baseRgb = { r: 231, g: 237, b: 243 }; // #E7EDF3

    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 150:
        // keep explicit cream used for the top area in screenshots
        return '#E8EDF3';
      case 100:
        return '#f9f9f9ff';
      case 75:
        return '#c2d3e3ff';
      case 50:
        return '#b3c5d0ff';
      case 25:
        return '#a1c8faff';
      default:
        // If a numeric shade is provided (e.g. 80), interpret it as a percentage and clamp to [0,1]
        if (typeof shade === 'number') {
          const alpha = Math.max(0, Math.min(1, shade / 100));
          return toRgba(alpha);
        }
        return toRgba(1);
    }
  },

  background02: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      // allow explicit custom alpha
      return `rgba(231, 237, 243, ${shade.custom})`;
    }

    // Use the same base as background01: #E7EDF3
    const baseRgb = { r: 231, g: 237, b: 243 };
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 125:
        // slight variant — keep same as base for now
        return '#E7EDF3';
      case 100:
        return '#E7EDF3'; // main background
      case 75:
        return toRgba(0.75);
      case 50:
        return toRgba(0.5);
      case 25:
        return toRgba(0.25);
      default:
        if (typeof shade === 'number') {
          const alpha = Math.max(0, Math.min(1, shade / 100));
          return toRgba(alpha);
        }
        return toRgba(1);
    }
  },

  // Secondary: muted surface/secondary CTA colors (light gray chips / secondary buttons)
  secondary01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(235, 241, 246, ${shade.custom})`;
    }
    switch (shade) {
      case 125:
        return '#EDF4F9';
      case 100:
        return '#E9EEF3'; // default secondary surface
      case 75:
        return '#DEE7EE';
      case 50:
        return '#D5E0E8';
      case 25:
        return '#F6FAFC';
      default:
        return `rgba(233, 238, 243, ${shade ?? 1})`;
    }
  },

  negative: (_shade: Shade = 100) => '#AF183C',
  positive: (_shade: Shade = 100) => '#1FA66A',

  // Text tones tuned for light surfaces
  text01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(12, 18, 25, ${shade.custom})`;
    }
    switch (shade) {
      case 125:
        return '#0C1219';
      case 100:
        return '#1F2933';
      case 75:
        return '#4A5560';
      case 50:
        return '#8A96A3';
      case 25:
        return '#CED6DE';
      default:
        return '#ffffff'; // full white for 0-24
    }
  },

  text02: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(12, 18, 25, ${shade.custom})`;
    }
    switch (shade) {
      case 125:
        return '#206090';
      case 100:
        return '#3576a8ff';
      case 75:
        return '#4b7493ff';
      case 50:
        return '#5d798fff';
      case 25:
        return '#206090';
      default:
        return `rgba(12, 18, 25, ${shade ?? 1})`;
    }
  },

  button01: (_shade: Shade = 100) => {
    // Use the same white-surface base as background (but for button surface variants)
    if (typeof _shade === 'object' && 'custom' in _shade) {
      return `rgba(232, 237, 243, ${_shade.custom})`;
    }

    const baseRgb = { r: 232, g: 237, b: 243 }; // #E8EDF3
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (_shade) {
      case 125:
        return '#E8EDF3';
      case 100:
        return '#E8EDF3';
      case 75:
        return toRgba(0.75);
      case 50:
        return toRgba(0.5);
      case 25:
        return toRgba(0.25);
      default:
        if (typeof _shade === 'number') {
          const alpha = Math.max(0, Math.min(1, _shade / 100));
          return toRgba(alpha);
        }
        return toRgba(1);
    }
  },

  button02: (shade: Shade = 100) => {
    // Use new base color #1179D4 and provide variants for 125,100,75,50,25
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(17, 121, 212, ${shade.custom})`;
    }

    const baseRgb = { r: 17, g: 121, b: 212 }; // #1179D4
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 125:
        // slightly darker variant
        return '#0E69BF';
      case 100:
        return '#1179D4';
      case 75:
        return toRgba(0.75);
      case 50:
        return toRgba(0.5);
      case 25:
        return toRgba(0.25);
      default:
        if (typeof shade === 'number') {
          const alpha = Math.max(0, Math.min(1, shade / 100));
          return toRgba(alpha);
        }
        return toRgba(1);
    }
  },
};
