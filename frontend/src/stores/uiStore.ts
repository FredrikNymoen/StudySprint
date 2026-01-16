import { create } from 'zustand';

interface UIState {
    sidebarOpen: boolean;
    activeView: 'dashboard' | 'sprints' | 'sessions' | 'stats';

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setActiveView: (view: UIState['activeView']) => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    activeView: 'dashboard',

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    setActiveView: (view) => set({ activeView: view }),
}));
