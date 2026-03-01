import { Navigate } from 'react-router-dom'
import { useAuth} from "../../context/AuthenticationContext.tsx";
import * as React from "react";
import Spinner from "./Spinner.tsx";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) return <Spinner />

    if (!isAuthenticated) return <Navigate to="/auth" replace />

    return <>{children}</>
}