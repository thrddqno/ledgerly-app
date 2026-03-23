import { TransactionList } from '../domains/transactions/components/TransactionList.tsx'
import { useTransactions } from '../domains/transactions/hooks/useTransaction.ts'
import { WalletCarousel } from '../domains/wallets/components/WalletCarousel.tsx'
import { useWalletStore } from '../domains/wallets/stores/walletStore.ts'
import NavBar from '../shared/ui/layout/NavBar.tsx'
import SideBar from '../shared/ui/layout/SideBar.tsx'

export default function TransactionsPage() {
    const selectedWallet = useWalletStore((state) => state.selectedWalletId)
    const { data, isLoading, hasNextPage, fetchNextPage } = useTransactions({
        walletId: selectedWallet,
        size: 20,
    })

    return (
        <div className="bg-base-200 flex flex-row ">
            <SideBar />
            <div className="flex flex-col w-full h-screen overflow-hidden px-7 py-3">
                <NavBar />
                <WalletCarousel />
                <div className={'mt-5'}>
                    <TransactionList
                        transactions={data?.flat ?? []}
                        isLoading={isLoading}
                        onFetchNextPage={
                            hasNextPage ? () => fetchNextPage() : undefined
                        }
                        resetScroll={selectedWallet}
                    />
                </div>
            </div>
        </div>
    )
}
