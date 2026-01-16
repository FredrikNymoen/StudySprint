import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUIStore } from '../../stores';

interface SidebarProps {
    onClose?: () => void;
}

const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊', view: 'dashboard' as const },
    { to: '/timer', label: 'Timer', icon: '⏱️', view: 'sessions' as const },
    { to: '/sprints', label: 'Sprints', icon: '🎯', view: 'sprints' as const },
    { to: '/stats', label: 'Statistikk', icon: '📈', view: 'stats' as const },
];

export function Sidebar({ onClose }: SidebarProps) {
    const location = useLocation();
    const { setActiveView, setSidebarOpen } = useUIStore();

    // Update activeView when route changes
    useEffect(() => {
        const currentItem = navItems.find((item) => item.to === location.pathname);
        if (currentItem) {
            setActiveView(currentItem.view);
        }
    }, [location.pathname, setActiveView]);

    // Close sidebar on mobile when navigating
    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-xl font-bold text-indigo-600">StudySprint</h1>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded hover:bg-gray-100"
                    >
                        ✕
                    </button>
                )}
            </div>

            <nav className="space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
