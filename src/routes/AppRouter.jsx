// Important 

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/auth/LoginPage";
import Homepage from "../pages/common/Homepage";
import NotFoundPage from "../pages/common/NotFoundPage";
import PtcRoute from "./ptcRoute";
import RegisterPage from "../pages/auth/RegisterPage";
import Challenge2FAPage from "../pages/auth/Challenge2FAPage";
import Setup2FAPage from "../pages/auth/Setup2FAPage";

function PublicOnlyRoute({children}){

    const{isAuthenticated, isLoading} = useAuth();
    if (isLoading) return <p>loading...</p>
    if (isAuthenticated) return <Navigate to="/" replace />;
    return children; 
}

function AppRouter(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<PublicOnlyRoute> <RegisterPage /></PublicOnlyRoute>} />
                <Route path="/login" element={<PublicOnlyRoute> <LoginPage /></PublicOnlyRoute>} />
                <Route path="/login/sfa" element={<PublicOnlyRoute> <Challenge2FAPage/></PublicOnlyRoute>}/>
                <Route path="/" element={<PtcRoute> <Homepage /></PtcRoute> } />
                <Route path="*" element={ <NotFoundPage />} />
                <Route path="/register/setup-2fa" element={<PublicOnlyRoute><Setup2FAPage/></PublicOnlyRoute>} />  {/* 2FA ----3-03*/}
            </Routes>   
        </BrowserRouter>
    );
}

export default AppRouter;