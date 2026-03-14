import { Route, Routes } from 'react-router-dom'

import { useAuthInit } from '../domains/auth/hooks/useAuthInit.ts'
import AuthPage from '../pages/AuthPage.tsx'

function App() {
    useAuthInit()
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
        </Routes>
    )
}

export default App
