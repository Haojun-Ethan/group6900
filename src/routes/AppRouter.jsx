// Important 

import { BrowserRouter, Routes, Route,  } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import Homepage from "../pages/common/Homepage";
import NotFoundPage from "../pages/common/NotFoundPage";
import PtcRoute from "./ptcRoute";
import RegisterPage from "../pages/auth/RegisterPage";
import Challenge2FAPage from "../pages/auth/Challenge2FAPage";


/* rewrite 5-01 */
function AppRouter(){
    return(
        <BrowserRouter>
            <Routes>
                {/* Pulic, rewrite 5-01 */ }
                <Route path="/login" element={<PtcRoute require="guest"><LoginPage /></PtcRoute>} />
                <Route path="/register" element={<PtcRoute require="guest"><RegisterPage /></PtcRoute>} />
                <Route path="/login/2fa" element={<PtcRoute require="mfa"><Challenge2FAPage /></PtcRoute>} />
                <Route path="/" element={<PtcRoute require="auth"><Homepage /></PtcRoute>} />
                <Route path="*" element={<NotFoundPage />} />
                    
            </Routes>   
        </BrowserRouter>
    );
}

export default AppRouter;