import NavBar from '../shared/ui/layout/NavBar.tsx'
import SideBar from '../shared/ui/layout/SideBar.tsx'

//todo: implement dashboard page
export default function DashboardPage() {
    return (
        <div className="bg-base-200 flex flex-row items-center justify-center">
            <SideBar />
            <div className="flex flex-col w-full h-screen px-7 py-3">
                {/* note: for the moment, its h-screen but will put h-full once it's populated */}
                <NavBar />
            </div>
        </div>
    )
}
