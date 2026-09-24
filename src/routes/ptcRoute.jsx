import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


/**    rewrite 5-01
 *  based on auth state display route
 * @param {{ children: JSX.Element, require: 'auth' | 'guest' | 'mfa' }} props
 */
function PtcRoute({ children, require = 'auth' }) {
  const { authState } = useAuth();

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
  return children; // longged in 
}

export default PtcRoute;