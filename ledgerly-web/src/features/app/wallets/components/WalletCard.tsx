import { getWalletBalance, type Wallet } from '../types/wallet.ts'
import { formatCurrency } from '../../../../common/utils/currencyFormatter.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useDevice } from '../../../../common/context/DeviceContext.tsx'

type Props =
    | {
          wallet: Wallet
          isSelected: boolean
          modifiable: true
          onClick: (wallet: Wallet) => void
          onEdit: (wallet: Wallet) => void // required when modifiable is true
      }
    | {
          wallet: Wallet
          isSelected: boolean
          modifiable?: false
          onClick: (wallet: Wallet) => void
          onEdit?: never // forbidden when modifiable is false
      }

export default function WalletCard({ wallet, isSelected, onClick, modifiable, onEdit }: Props) {
    const { breakpoint } = useDevice()
    const showEdit = breakpoint != 'desktop' && isSelected
    const balance = getWalletBalance(wallet)
    const isPositive = balance >= 0
    const formatted = formatCurrency(balance, 'PHP')

    return (
        <div className="group relative">
            <button
                onClick={() => onClick(wallet)}
                className={`text-text-primary group-hover:shadow-text-primary/10 flex w-full shrink-0 cursor-pointer flex-col justify-center gap-2 rounded-md border p-4 text-left transition-all duration-150 group-hover:shadow-lg ${
                    isSelected
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-surface hover:border-border-hover'
                }`}
            >
                <div className="flex w-full flex-row items-center gap-4">
                    <div className="bg-accent/10 text-accent flex h-10 w-10 items-center justify-center rounded-3xl">
                        <FontAwesomeIcon icon={faWallet} />
                    </div>
                    <div className="flex min-w-0 flex-col items-start">
                        <span className="text-text-primary tablet:text-xs desktop:text-sm phone:text-[0.75rem] truncate">
                            {wallet.name}
                        </span>

                        <span
                            className={`phone:text-[0.75rem] tablet:text-xs desktop:text-sm w-full truncate text-base font-semibold tabular-nums ${isPositive ? 'text-income' : 'text-expense'} `}
                        >
                            {isPositive ? '+' : ''}
                            {formatted}
                        </span>
                    </div>
                </div>
            </button>
            {modifiable && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit?.(wallet)
                    }}
                    className={`hover:bg-accent-hover text-text-muted absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:text-neutral-50 ${
                        showEdit
                            ? ''
                            : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                    }`}
                >
                    <FontAwesomeIcon icon={faPencil} className="text-xs" />
                </button>
            )}
        </div>
    )
}
