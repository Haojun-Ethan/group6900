import ReactDOM from 'react-dom/client'
import React from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import { runAuthApiSelfTest } from './api/test/auth.test.js'

import App from './App.jsx'

if (import.meta.env.DEV && import.meta.env.VITE_RUN_API_SELF_TEST === 'true') {
  runAuthApiSelfTest();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);