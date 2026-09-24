import { createTheme } from "@mui/material";

const theme = createTheme (
    {palette:{
        mode:'light',

        background:{
            default:'#f5f5f7',
            paper:'#ffffff',
        },
   text: {
      primary: '#2c2c2c',      // Main text 
      secondary: '#666666',
      disabled: '#9e9e9e',
    },

    // Primary / 主色
    primary: {
      main: '#3b5b8c',
      light: '#6b87b5',
      dark: '#2a4370',
      contrastText: '#ffffff',
    },

    // Semantic / 语义色
    success: { main: '#4c8c5a' },
    warning: { main: '#c08a3e' },
    error:   { main: '#a94442' },
    info:    { main: '#5a7d9a' },

    divider: 'rgba(0, 0, 0, 0.08)',
  },

  // Breakpoints / 断点
  breakpoints: {
    values: {
      xs: 0,       // Phone / 手机
      sm: 600,     // Large phone 
      md: 900,     // Tablet / 平板
      lg: 1200,    // Desktop 
      xl: 1536,    // Large desktop 
    },
  },

  // Typography / 字体
  typography: {
    fontFamily: [
      '-apple-system',         // macOS / iOS
      'BlinkMacSystemFont',
      '"Segoe UI"',            // Windows
      'Roboto',                // Android
      '"Helvetica Neue"',
      'Arial',
      '"PingFang SC"',         // macOS CJK
      '"Microsoft YaHei"',     // Windows CJK
      'sans-serif',
    ].join(','),

    // Reading-friendly 
    body1: { fontSize: '1rem',     lineHeight: 1.7 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },

    // clamp() = responsive font size
    h1: { fontSize: 'clamp(1.5rem, 4vw, 2rem)',  fontWeight: 600, lineHeight: 1.3 },
    h2: { fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',   fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 600, lineHeight: 1.4 },

    button: { textTransform: 'none', fontWeight: 500 },
  },

  shape: { borderRadius: 8 },

  // Component overrides 
  components: {
    // Touch-friendly button 
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,          // Touch target 
          padding: '10px 20px',
          fontSize: '0.95rem',
        },
        sizeLarge: { minHeight: 48, fontSize: '1rem' },
      },
    },

    // Prevent iOS zoom on focus / 防 iOS 焦点自动缩放
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '16px',
          '@media (min-width:600px)': { fontSize: '0.95rem' },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
        fullWidth: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: '#ffffff' },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: { minHeight: 44 },
      },
    },
  },
});

export default theme;