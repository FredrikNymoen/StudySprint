import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/timer', label: 'Timer', icon: '⏱️' },
    { to: '/sprints', label: 'Sprints', icon: '🎯' },
    { to: '/stats', label: 'Statistikk', icon: '📈' },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
            <div className="mb-8">
                <h1 className="text-xl font-bold text-indigo-600">StudySprint</h1>
            </div>

            <nav className="space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
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
