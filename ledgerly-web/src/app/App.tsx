import {Route, Routes} from "react-router-dom";
import LoginPage from "../pages/app/Auth/LoginPage.tsx";
import DashboardPage from "../pages/app/dashboard/DashboardPage.tsx";
import ProtectedRoute from "../components/common/ProtectedRoute.tsx";
import RegisterPage from "../pages/app/Auth/RegisterPage.tsx";


function App() {
    return(
        <Routes>
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            }/>
        </Routes>
    )
}

export default App
