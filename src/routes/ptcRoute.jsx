import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";


/**    rewrite 5-01
 *  based on auth state display route
 * @param {{ children: JSX.Element, require: 'auth' | 'guest' | 'mfa' }} props
 */
function PtcRoute({ children, require = 'auth' }) {
  const { authState } = useAuth();
    if (authState === 'LOADING') {
      return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (require === 'auth' && authState !== 'AUTHENTICATED') {
      if (authState === 'MFA_PENDING') return <Navigate to="/login/2fa" replace />;
      return <Navigate to="/login" replace />;
    }

    if (require === 'guest' && authState === 'AUTHENTICATED') return <Navigate to="/" replace />;
    if (require === 'guest' && authState === 'MFA_PENDING') return <Navigate to="/login/2fa" replace />;

    if (require === 'mfa' && authState !== 'MFA_PENDING') {
      return <Navigate to={authState === 'AUTHENTICATED' ? '/' : '/login'} replace />;
    }

 
  return children; // longged in 
}

export default PtcRoute;


/* MUI---- 6-01
function PtcRoute({ children, require = 'auth' }) {
  const { authState } = useAuth();
 if(authState === 'LOADING')  return <p>Loading...</p>; // waitting resolution

  if (require === 'auth' && authState !== 'AUTHENTICATED') {
    return <Navigate to="/login" replace />;
  }
  if (require === 'guest' && authState === 'AUTHENTICATED') {
    return <Navigate to="/" replace />;
  }

  if (require === 'guest' && authState === 'MFA_PENDING') {
    return <Navigate to="/login/2fa" replace />;
  }

  if (require === 'mfa' && authState !== 'MFA_PENDING') {
    return <Navigate to={ authState === 'AUTHENTICATED' ? '/' : '/login'} replace />;
  }   
*/