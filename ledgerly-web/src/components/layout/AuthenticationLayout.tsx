import type {ReactNode} from 'react';
import AuthHeader from "./AuthenticationHeader.tsx";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <AuthHeader />
            <main className="flex items-center justify-center py-16">
                {children}
            </main>
        </div>
    )
}