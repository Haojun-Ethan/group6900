// Important 

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/auth/LoginPage";
import Homepage from "../pages/common/Homepage";
import NotFoundPage from "../pages/common/NotFoundPage";
import PtcRoute from "./ptcRoute";


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
                <Route path="/login" element={<PublicOnlyRoute> <LoginPage /></PublicOnlyRoute>} />
                <Route path="/" element={<PtcRoute> <Homepage /></PtcRoute> } />
                <Route path="*" element={ <NotFoundPage />} />
            </Routes>   
        </BrowserRouter>
    );
}

export default AppRouter;