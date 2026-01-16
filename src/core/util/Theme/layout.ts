import { Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';

const window = Dimensions.get('window');
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = window;

// Base design dimensions (iPhone X-like baseline)
const baseWidth = 375;
const baseHeight = 812;

export const layout = {
  // Grid system and container sizes
  maxContainerWidth: 1224,
  maxColumnWidth: 80,
  gutterWidth: {
    desktop: 24,
    mobile: 16,
  },

  // Breakpoints (device widths)
  breakpoints: {
    mobile: 375,
    tablet: 1024,
    desktop: 1280,
    largeDesktop: 1920,
  },

  // Spacing tokens
  spacing: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
    xxxxl: 56,
    xxxxxl: 64,
  },

  // Window dimensions (current)
  window: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  // Shadow presets consumers may reuse
  shadows: {
    dropShadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

// Responsive helpers

export const getResponsiveValue = (
  mobileValue: number,
  tabletValue: number,
  desktopValue: number,
) => {
  const w = SCREEN_WIDTH;
  if (w >= layout.breakpoints.desktop) return desktopValue;
  if (w >= layout.breakpoints.tablet) return tabletValue;
  return mobileValue;
};

export const getColumnCount = () => {
  const w = SCREEN_WIDTH;
  if (w >= layout.breakpoints.desktop) return 12;
  if (w >= layout.breakpoints.tablet) return 8;
  return 4;
};

export const getMarginWidth = () => {
  const w = SCREEN_WIDTH;
  if (w >= layout.breakpoints.desktop) {
    return Math.max(0, (w - layout.maxContainerWidth) / 2);
  }
  return layout.spacing.l;
};

// Basic responsive math (scale based on base design)
export const getResponsiveWidth = (size: number) => {
  return (SCREEN_WIDTH / baseWidth) * size;
};

export const getResponsiveHeight = (size: number) => {
  return (SCREEN_HEIGHT / baseHeight) * size;
};

export const getResponsiveFontSize = (size: number) => {
  // Round to nearest pixel for crisp text
  const scaled = (SCREEN_WIDTH / baseWidth) * size;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

export const getResponsiveSpacing = (size: number) => {
  const scaled = (SCREEN_WIDTH / baseWidth) * size;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

// Semantic helpers used by typography and components
export const getFontSize = (small: number, medium: number, large: number) => {
  const w = SCREEN_WIDTH;
  if (w < layout.breakpoints.tablet) {
    return getResponsiveFontSize(small);
  } else if (w < layout.breakpoints.desktop) {
    return getResponsiveFontSize(medium);
  }
  return getResponsiveFontSize(large);
};

export const getLineHeight = (small: number, medium: number, large: number) => {
  const w = SCREEN_WIDTH;
  if (w < layout.breakpoints.tablet) {
    return getResponsiveSpacing(small);
  } else if (w < layout.breakpoints.desktop) {
    return getResponsiveSpacing(medium);
  }
  return getResponsiveSpacing(large);
};

export const getSpacing = (small: number, medium: number, large: number) => {
  const w = SCREEN_WIDTH;
  if (w < layout.breakpoints.tablet) {
    return getResponsiveSpacing(small);
  } else if (w < layout.breakpoints.desktop) {
    return getResponsiveSpacing(medium);
  }
  return getResponsiveSpacing(large);
};

// Safe area helper (basic, not full insets library)
export const getSafeAreaInsets = () => {
  const { height, width } = Dimensions.get('window');
  const isIPhoneX =
    Platform.OS === 'ios' &&
    (height === 812 || width === 812 || height === 896 || width === 896);

  if (Platform.OS === 'ios') {
    return {
      top: isIPhoneX ? 44 : 20,
      bottom: isIPhoneX ? 34 : 0,
      left: 0,
      right: 0,
    };
  }

  return {
    top: StatusBar.currentHeight || 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
};

// Scaling utilities for other parts of the app
export const relativeWidth = (w = 0) => {
  const newSize = w * (SCREEN_WIDTH / baseWidth);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const relativeHeight = (h = 0) => {
  const newSize = h * (SCREEN_HEIGHT / baseHeight);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const getScaledValue = (size = 0, height = 0) => {
  if (size !== 0) {
    const newSize = size * (SCREEN_WIDTH / baseWidth);
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    const newSize = height * (SCREEN_HEIGHT / baseHeight);
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
};

// Export convenient names so other modules can import a single object if desired
export const responsiveUtils = {
  getResponsiveValue,
  getResponsiveWidth,
  getResponsiveHeight,
  getResponsiveFontSize,
  getResponsiveSpacing,
  getColumnCount,
  getMarginWidth,
  getSafeAreaInsets,
  relativeWidth,
  relativeHeight,
  getScaledValue,
};
