import SideBar from '../../../components/layout/SideBar.tsx'
import BalanceSummary from '../../../components/dashboard/BalanceSummary.tsx'
import { useWallets } from '../../../context/WalletContext.tsx'
import WalletList from '../../../components/dashboard/WalletList.tsx'
import RecentTransactions from '../../../components/dashboard/RecentTransactions.tsx'
import { MOCK_TRANSACTIONS } from '../../../utils/mocks/transactionMocks.ts'

export default function DashboardPage() {
    const { wallets } = useWallets()
    return (
        <div className="bg-base flex h-screen w-screen justify-between overflow-hidden">
            <SideBar />

            <main className="border-border flex flex-1 flex-col gap-4 overflow-y-auto border-r p-5">
                <BalanceSummary wallets={wallets} />
                <WalletList />
            </main>

            <section className="overflow-hidden">
                <RecentTransactions transactions={MOCK_TRANSACTIONS} />
            </section>
        </div>
    )
}
