// Important 

import { BrowserRouter, Routes, Route,  } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import Homepage from "../pages/common/Homepage";
import NotFoundPage from "../pages/common/NotFoundPage";
import PtcRoute from "./ptcRoute";
import RegisterPage from "../pages/auth/RegisterPage";
import Challenge2FAPage from "../pages/auth/Challenge2FAPage";
import AccountPage from '../pages/account/AccountPage';
import Setup2FAPage from '../pages/account/Setup2FAPage';
import PlaceholderPage from "../pages/common/PlaceholderPage";
import AppLayout from "../components/layout/AppLayout";


/* rewrite 5-01 */
function AppRouter(){
    return(
        <BrowserRouter>
            <Routes>
                {/* Pulic, rewrite 5-01 */ }
                <Route path="/login" element={<PtcRoute require="guest"><LoginPage /></PtcRoute>} />
                <Route path="/register" element={<PtcRoute require="guest"><RegisterPage /></PtcRoute>} />
                <Route path="/login/2fa" element={<PtcRoute require="mfa"><Challenge2FAPage /></PtcRoute>} />
                
                <Route element={<PtcRoute require="auth"> <AppLayout /></PtcRoute> }>
                
                    <Route path="/" element={Homepage}/>

                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/account/2fa/setup" element= {<Setup2FAPage/>} />

                    <Route path="/modules" element={<PlaceholderPage />} />
                    <Route path="/user/modules" element={<PlaceholderPage />} />
                    <Route path="/owner/modules" element={<PlaceholderPage />} />
                    <Route path="/admin/users" element={<PlaceholderPage />} />
                                
                
                
                </Route>

                <Route path="*" element={<NotFoundPage />} />
                    
            </Routes>   
        </BrowserRouter>
    );
}

export default AppRouter;