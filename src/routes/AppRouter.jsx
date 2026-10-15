// Important 

import { BrowserRouter, Routes, Route,  } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import Homepage from "../pages/common/HomePage";
import NotFoundPage from "../pages/common/NotFoundPage";
import PtcRoute from "./ptcRoute";
import RegisterPage from "../pages/auth/RegisterPage";
import Challenge2FAPage from "../pages/auth/Challenge2FAPage";
import AccountPage from '../pages/account/AccountPage';
import Setup2FAPage from '../pages/account/Setup2FAPage';
//import PlaceholderPage from "../pages/common/PlaceholderPage";
import AppLayout from "../components/layout/AppLayout";
import ModuleListPage from "../pages/modules/ModuleListPage";
import ModuleDetailPage from "../pages/modules/ModuleDetailPage";
import ManageModulesPage from '../pages/modules/owner/ManageModulesPage';
import MyModulesPage from '../pages/modules/user/MyModulesPage';
import StudyPage from '../pages/modules/user/StudyPage';
import ModuleFormPage from "../pages/modules/owner/ModuleFormPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import QuizResultPage from  "../pages/quizzes/user/QuizResultPage";
import QuizGalleryPage from "../pages/quizzes/QuizGalleryPage";
import TakeQuizPage from "../pages/quizzes/user/TakeQuizPage";
import QuizDemoPage from  "../pages/quizzes/QuizDemoPage.jsx"



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
                
                    <Route path="/" element={<Homepage />}/>
       
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/account/2fa/setup" element= {<Setup2FAPage/>} />

                    <Route path="/modules" element={<ModuleListPage />} />              {/* change by 07-01 PlaceholderPage-> ModuleListPage */ }
                    <Route path="/modules/:id" element={<ModuleDetailPage />} />        {/* add by 07-01  */ }
                    <Route path="/user/modules" element={<MyModulesPage />} />           {/* change by 07-01 PlaceholderPage-> ModuleListPage */ }
                    <Route path="/user/modules/:id/study" element={<StudyPage />} />     {/* add by 07-01  */ }
                    <Route path="/owner/modules" element={<ManageModulesPage />} />     {/* change by 07-01 PlaceholderPage-> ModuleListPage */ }
                    
                    <Route path="/owner/modules/create" element={<ModuleFormPage />} />     {/* add by 07-01  */ }
                    <Route path="/owner/modules/:id/edit" element={<ModuleFormPage />} />   {/* add by 07-01  */ }
                    <Route path="/quiz-demo"    element ={<QuizDemoPage />} />              {/* add by 07-01  */ }
                    <Route path="/quiz-gallery" element ={<QuizGalleryPage />} />           {/* add by 07-01  */ }
                    <Route path="/user/modules/:id/quiz" element={<TakeQuizPage />} />      {/* add by 07-02  */ }
                    <Route path="/user/modules/:id/quiz/result/:attemptId" element={<QuizResultPage />} />  {/* add by 07-02  */ }
                    <Route path="/admin/users" element={<ManageUsersPage />} />
                                
                
                
                </Route>

                <Route path="*" element={<NotFoundPage />} />
                    
            </Routes>   
        </BrowserRouter>
    );
}

export default AppRouter;