import { WalletProvider } from '../context/WalletContext.tsx'
import { AuthProvider } from '../context/AuthenticationContext.tsx'
import { ModalProvider } from '../context/ModalContext.tsx'
import { CategoryProvider } from '../context/CategoryContext.tsx'
import { TransactionProvider } from '../context/TransactionContext.tsx'

interface Props {
    children: React.ReactNode
}

export default function AppProviders({ children }: Props) {
    return (
        <AuthProvider>
            <WalletProvider>
                <CategoryProvider>
                    <TransactionProvider>
                        <ModalProvider>{children}</ModalProvider>
                    </TransactionProvider>
                </CategoryProvider>
            </WalletProvider>
        </AuthProvider>
    )
}
