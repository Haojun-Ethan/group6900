import { GlobalStyles } from "@mui/material";

/** Important
 * Global CSS applied to whole app

 */
function AppGlobalStyles() {
  return (
    <GlobalStyles
      styles={{
        'html, body, #root': {
          height: '100%',
          margin: 0,
          padding: 0,
        },
        body: {
          backgroundColor: '#f5f5f7',
          color: '#2c2c2c',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': {
          backgroundColor: 'rgba(59, 91, 140, 0.15)',
        },
        '::-webkit-scrollbar': { width: 10, height: 10 },
        '::-webkit-scrollbar-track': { background: '#ececec' },
        '::-webkit-scrollbar-thumb': {
          background: '#c0c0c0',
          borderRadius: 5,
        },
        '::-webkit-scrollbar-thumb:hover': { background: '#a0a0a0' },
      }}
    />
  );
}

export default AppGlobalStyles;