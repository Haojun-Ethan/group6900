// The context object on its own, so AuthContext.jsx only exports a component (keeps React Fast Refresh working).
import { createContext } from 'react';

export const AuthContext = createContext(null);
