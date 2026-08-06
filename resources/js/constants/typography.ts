// Typography Configuration
export const TYPOGRAPHY = {
  fonts: {
    primary: "'Instrument Sans', 'Inter', system-ui, -apple-system, sans-serif",
    display: "'Instrument Sans', 'Inter', system-ui, -apple-system, sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },
  sizes: {
    // Display styles - Hero sections
    display_xl: { size: '48px', lineHeight: '1.2', weight: 700 },  // 48/58
    display_lg: { size: '40px', lineHeight: '1.2', weight: 700 },  // 40/48
    display_md: { size: '32px', lineHeight: '1.3', weight: 700 },  // 32/42
    
    // Heading styles
    h1: { size: '32px', lineHeight: '1.3', weight: 700 },           // 32/42
    h2: { size: '28px', lineHeight: '1.4', weight: 700 },           // 28/39
    h3: { size: '24px', lineHeight: '1.4', weight: 600 },           // 24/34
    h4: { size: '20px', lineHeight: '1.5', weight: 600 },           // 20/30
    h5: { size: '18px', lineHeight: '1.5', weight: 600 },           // 18/27
    h6: { size: '16px', lineHeight: '1.6', weight: 600 },           // 16/26
    
    // Body text
    body_lg: { size: '18px', lineHeight: '1.6', weight: 400 },     // 18/28
    body_base: { size: '16px', lineHeight: '1.6', weight: 400 },   // 16/24
    body_sm: { size: '14px', lineHeight: '1.6', weight: 400 },     // 14/21
    body_xs: { size: '12px', lineHeight: '1.5', weight: 400 },     // 12/18
    
    // Labels
    label_lg: { size: '14px', lineHeight: '1.5', weight: 600 },    // 14/21
    label_md: { size: '12px', lineHeight: '1.5', weight: 600 },    // 12/18
    label_sm: { size: '11px', lineHeight: '1.45', weight: 600 },   // 11/16
    
    // Caption
    caption: { size: '12px', lineHeight: '1.5', weight: 400 },     // 12/18
  },
};

export default TYPOGRAPHY;
