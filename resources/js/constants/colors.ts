// Church branding colors from the Horaios Baptist Church logo
export const BRAND_COLORS = {
  primary: {
    red: '#74121c',        // Main burgundy from logo
    darkRed: '#5a0e16',    // Darker shade for contrast & hover
    lightRed: '#962028',   // Lighter shade for highlights
    navy: '#273161',       // Secondary navy from logo
    darkNavy: '#1d2549',
    lightNavy: '#354278',
  },
  secondary: {
    blue: '#273161',       // Signature navy blue from logo
    darkBlue: '#1d2549',
    lightBlue: '#354278',
  },
  accent: {
    red: '#74121c',
    darkRed: '#5a0e16',
    lightRed: '#962028',
    blue: '#273161',
  },
  neutral: {
    white: '#ffffff',
    black: '#0f172a',
    gray50: '#f8fafc',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a',
  },
  semantic: {
    success: '#059669',
    warning: '#f59e0b',
    error: '#dc2626',
    info: '#0284c7',
  },
};

export const COLOR_PALETTE = {
  ...BRAND_COLORS,
  gradient: {
    redToBlue: `linear-gradient(135deg, ${BRAND_COLORS.primary.red}, ${BRAND_COLORS.secondary.blue})`,
    redToWhite: `linear-gradient(180deg, ${BRAND_COLORS.primary.red}, ${BRAND_COLORS.neutral.white})`,
  },
};

export default BRAND_COLORS;
