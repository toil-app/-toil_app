import { AppTheme, ThemeMode } from './Theme';
import { Shade } from '../fonts/FontConfig';

export const DarkTheme: AppTheme = {
  // dark-mode neutrals
  dark: '#0B1218', // deep background
  light: '#FFFFFF',
  mode: ThemeMode.DARK,
  // Primary: keep same bright brand blue for CTAs on dark background
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

  // Background variations for dark layout
  background01: (shade: Shade = 100) => {
    // Use base dark surface #232F48 and expose subtle variants
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(35, 47, 72, ${shade.custom})`;
    }

    const baseRgb = { r: 35, g: 47, b: 72 }; // #232F48
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 125:
        // slightly darker variant for depth
        return '#1F2A3F';
      case 100:
        return '#232F48'; // base dark background
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

  background02: (shade: Shade = 100) => {
    // Base for background02 is #111722 (rgb(17,23,34)). Expose consistent rgba variants
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(17, 23, 34, ${shade.custom})`;
    }

    const baseRgb = { r: 17, g: 23, b: 34 }; // #111722
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 125:
        // slightly darker variant for depth
        return '#0f1620';
      case 100:
        return '#111722'; // base background used in dark screens
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

  // Secondary: dark surfaces used for chips / secondary buttons
  // Base changed to #242F48 (rgb(36,47,72)) and provide consistent rgba variants
  secondary01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(36, 47, 72, ${shade.custom})`;
    }

    const baseRgb = { r: 36, g: 47, b: 72 }; // #242F48
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 125:
        // slightly darker variant for depth
        return '#20283a';
      case 100:
        return '#242F48'; // base dark surface for secondary CTA
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

  negative: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(175, 24, 60, ${shade.custom})`;
    }
    switch (shade) {
      case 125:
        return '#FF3B5C';
      case 100:
        return '#AF183C';
      case 75:
        return '#D6455A';
      case 50:
        return '#E66A78';
      case 25:
        return '#FF9CA8';
      default:
        return `rgba(175, 24, 60, ${shade ?? 1})`;
    }
  },
  positive: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(31, 166, 106, ${shade.custom})`;
    }
    switch (shade) {
      case 125:
        return '#1FA66A';
      case 100:
        return '#1FA66A';
      case 75:
        return '#34B57F';
      case 50:
        return '#66C99F';
      case 25:
        return '#99DCC0';
      default:
        return `rgba(31, 166, 106, ${shade ?? 1})`;
    }
  },
  // Text tuned for dark surfaces
  text01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(255,255,255, ${shade.custom})`;
    }
    switch (shade) {
      case 125:
        return '#FFFFFF';
      case 100:
        return '#E6EEF6';
      case 75:
        return '#AAB6BF';
      case 50:
        return '#7A8790';
      case 25:
        return '#4A5560';
      default:
        return '#000000';
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

  button01: (shade: Shade = 100) => {
    // Use base color #223C48 for button01 in dark theme and expose variants
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(34, 60, 72, ${shade.custom})`;
    }

    const baseRgb = { r: 34, g: 60, b: 72 }; // #223C48
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 125:
        // slightly darker variant
        return '#1E333C';
      case 100:
        return '#223C48';
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

  button02: (shade: Shade = 100) => {
    // Use base color #0F89BD and provide variants for dark theme button02
    if (typeof shade === 'object' && 'custom' in shade) {
      return `rgba(15, 137, 189, ${shade.custom})`;
    }

    const baseRgb = { r: 15, g: 137, b: 189 }; // #0F89BD
    const toRgba = (alpha: number) =>
      `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;

    switch (shade) {
      case 125:
        // slightly darker variant
        return '#0C73A0';
      case 100:
        return '#0F89BD';
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
