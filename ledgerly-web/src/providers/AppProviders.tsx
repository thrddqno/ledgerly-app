import { AuthProvider } from '../context/AuthenticationContext.tsx'
import { ModalProvider } from '../context/ModalContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DeviceProvider } from '../context/DeviceContext.tsx'
import { UIProvider } from '../context/UIContext.tsx'

interface Props {
    children: React.ReactNode
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
})

export default function AppProviders({ children }: Props) {
    return (
        <DeviceProvider>
            <UIProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <ModalProvider>{children}</ModalProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </UIProvider>
        </DeviceProvider>
    )
}
