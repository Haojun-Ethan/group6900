import { HashRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import Homepage from "../pages/common/Homepage";
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
import QuizResultPage from "../pages/quizzes/user/QuizResultPage";
import QuizGalleryPage from "../pages/quizzes/QuizGalleryPage";
import TakeQuizPage from "../pages/quizzes/user/TakeQuizPage";
import QuizDemoPage from "../pages/quizzes/QuizDemoPage.jsx";
import ManageQuizPage from "../pages/quizzes/owner/ManageQuizPage"; 
import PathwayListPage from '../pages/modules/user/PathwayListPage';
import PathwayDetailPage from '../pages/modules/user/PathwayDetailPage';
import ModuleEnrollmentsPage from '../pages/modules/owner/ModuleEnrollmentsPage';
import PathwayEditorPage from '../pages/modules/owner/PathwayEditorPage';
import NotificationsPage from '../pages/common/NotificationsPage';
import GradebookPage from '../pages/quizzes/owner/GradebookPage';
import AttemptReviewPage from '../pages/quizzes/owner/AttemptReviewPage';


/* rewrite 5-01 */
function AppRouter() {
    return (
        <HashRouter>
            <Routes>

                {/* Public, rewrite 5-01 */ }
                <Route path="/login" element={<PtcRoute require="guest"><LoginPage /></PtcRoute>} />
                <Route path="/register" element={<PtcRoute require="guest"><RegisterPage /></PtcRoute>} />
                <Route path="/login/2fa" element={<PtcRoute require="mfa"><Challenge2FAPage /></PtcRoute>} />

                <Route element={<PtcRoute require="auth"> <AppLayout /></PtcRoute>}>

                    <Route path="/" element={<Homepage />} />


                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/account/2fa/setup" element={<Setup2FAPage />} />

                    <Route path="/modules" element={<ModuleListPage />} />              {/* change by 07-01 PlaceholderPage-> ModuleListPage */ }
                    <Route path="/modules/:id" element={<ModuleDetailPage />} />        {/* add by 07-01  */ }
                    <Route path="/user/modules" element={<MyModulesPage />} />          {/* change by 07-01 PlaceholderPage-> ModuleListPage */ }
                    <Route path="/user/modules/:id/study" element={<StudyPage />} />    {/* add by 07-01  */ }
                    <Route path="/user/modules/:id/quiz" element={<TakeQuizPage />} />  {/* add by 07-02  */ }
                    <Route path="/user/modules/:id/quiz/result/:attemptId" element={<QuizResultPage />} />  {/* add by 07-02  */ }
                    


                    <Route path="/owner/modules" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><ManageModulesPage /></PtcRoute>} />           {/* add by 08-01 */ }
                    <Route path="/owner/modules/create" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><ModuleFormPage /></PtcRoute>} />       {/* add by 08-01 */ }
                    <Route path="/owner/modules/:id/edit" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><ModuleFormPage /></PtcRoute>} />     {/* add by 08-01 */ }
                    <Route path="/owner/modules/:id/enrollments" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><ModuleEnrollmentsPage /></PtcRoute>} />
                    <Route path="/owner/gradebook" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><GradebookPage /></PtcRoute>} />
                    <Route path="/owner/attempts/:attemptId" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><AttemptReviewPage /></PtcRoute>} />

                    <Route path="/admin/users" element={<PtcRoute require="auth" roles={['ADMIN']}><ManageUsersPage /></PtcRoute>} />                       {/* add by 08-01 */ }

                    <Route path="/quiz-demo" element={<QuizDemoPage />} />              {/* add by 07-01  */ }
                    <Route path="/quiz-gallery" element={<QuizGalleryPage />} />        {/* add by 07-01  */ }
                    <Route path="/owner/modules/:id/quiz" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><ManageQuizPage /></PtcRoute>} />        {/* add by 08-06 */ }

                    <Route path="/pathways" element={<PathwayListPage />} />             {/* add by 08-06 */ }
                    <Route path="/pathways/:id" element={<PathwayDetailPage />} />       {/* add by 08-06 */ }
                    <Route path="/owner/pathways/create" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><PathwayEditorPage /></PtcRoute>} />      {/*add by 09-01 */}
                    <Route path="/owner/pathways/:id/edit" element={<PtcRoute require="auth" roles={['OWNER', 'ADMIN']}><PathwayEditorPage /></PtcRoute>} />    {/* add by 09-01*/}
                     <Route path="/notifications" element={<NotificationsPage />} />     {/* add by 09-01 */}

                </Route>

                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </HashRouter>
    );
}

export default AppRouter;