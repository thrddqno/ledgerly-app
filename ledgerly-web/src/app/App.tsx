import { Routes } from 'react-router-dom'

import { useAuthInit } from '../domains/auth/hooks/useAuthInit.ts'

function App() {
    useAuthInit()
    return <Routes></Routes>
}

export default App
