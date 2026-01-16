import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../stores';

export function Layout() {
    const { sidebarOpen, toggleSidebar } = useUIStore();

    return (
        <div className="flex min-h-screen">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:static inset-y-0 left-0 z-30 transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar onClose={toggleSidebar} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile header */}
                <header className="lg:hidden flex items-center gap-4 p-4 border-b border-gray-200 bg-white">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <span className="text-xl">☰</span>
                    </button>
                    <h1 className="text-lg font-bold text-indigo-600">StudySprint</h1>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
