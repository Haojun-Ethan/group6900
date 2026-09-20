import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { get2FAFlow, getTempToken } from "../utils/storage";       /* 2FA ---- 3-04 */

function PtcRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // checking session /检查状态
  }

  if (!isAuthenticated) {
    // check 2FA flow 
    const tempToken = getTempToken();
    const flow = get2FAFlow();

    if (tempToken && flow === 'login') {    return <Navigate to='/login/2fa' replace />;    }         //check 2FA then routing
    if (tempToken && flow ==='register') {  return <Navigate to='/login/setup-2fa' replace/>;    }    /* 2FA ---- 3-04 */
    return <Navigate to="/login" />; // not logged in -> redirect  / 未登录
  }

  return children; // longged in /登录
}

export default PtcRoute;