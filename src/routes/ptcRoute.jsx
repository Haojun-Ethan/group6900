import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PtcRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // checking session /检查状态
  }

  if (!user) {
    return <Navigate to="/login" />; // not logged in -> redirect  / 未登录
  }

  return children; // longged in /登录
}

export default PtcRoute;