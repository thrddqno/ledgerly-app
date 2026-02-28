export default function Spinner() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
    )
}