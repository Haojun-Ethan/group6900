import ReactDOM from 'react-dom/client'
import React from 'react'
import { AuthProvider } from './context/AuthContext.jsx'

import App from './App.jsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import AppGlobalStyles from './theme/GlobalStyles.jsx'
import theme from './theme/index.js'

theme
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppGlobalStyles />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);