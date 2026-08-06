// Church Branding Colors derived from Horaios Baptist Church Logo
export const BRAND_COLORS = {
  primary: {
    red: '#C8102E',        // Primary Church Red from logo
    darkRed: '#9E0D24',    // Darker shade for contrast & hover
    lightRed: '#E11D48',   // Lighter shade for highlights
    navy: '#C8102E',       // Main primary brand color
    darkNavy: '#9E0D24',
    lightNavy: '#E11D48',
  },
  secondary: {
    blue: '#1E366D',       // Royal Blue from logo
    darkBlue: '#14254C',   // Dark blue
    lightBlue: '#2B4C91',  // Light blue
  },
  accent: {
    red: '#C8102E',
    darkRed: '#9E0D24',
    lightRed: '#E11D48',
    blue: '#1E366D',
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
