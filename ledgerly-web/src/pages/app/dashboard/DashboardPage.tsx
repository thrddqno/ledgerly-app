import Header from '../../../components/layout/Header'

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </main>
        </div>
    )
}