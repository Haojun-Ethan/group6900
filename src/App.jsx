// src/App.jsx

import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/auth/LoginPage';

function App() {

  const {user, isLoasding, logout} = useAuth();
  if (isLoasding) {
    return <div>Loading...</div>;
  }
  if (!user) return <LoginPage />;
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Roles: {user.roles.join(', ')}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;