import { create } from 'zustand';

interface TimerState {
    isRunning: boolean;
    isPaused: boolean;
    mode: 'pomodoro' | 'free';
    timeRemaining: number; // seconds for pomodoro
    timeElapsed: number; // seconds for free mode
    startedAt: string | null;
    selectedSprintId: number | null;

    // Actions
    setMode: (mode: 'pomodoro' | 'free') => void;
    startPomodoro: (duration?: number) => void;
    startFreeSession: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    tick: () => void;
    setSelectedSprint: (sprintId: number | null) => void;
}

const DEFAULT_POMODORO_MINUTES = 25;

export const useTimerStore = create<TimerState>((set, get) => ({
    isRunning: false,
    isPaused: false,
    mode: 'pomodoro',
    timeRemaining: DEFAULT_POMODORO_MINUTES * 60,
    timeElapsed: 0,
    startedAt: null,
    selectedSprintId: null,

    setMode: (mode) => {
        set({ mode });
    },

    startPomodoro: (duration = DEFAULT_POMODORO_MINUTES) => {
        set({
            isRunning: true,
            isPaused: false,
            mode: 'pomodoro',
            timeRemaining: duration * 60,
            timeElapsed: 0,
            startedAt: new Date().toISOString(),
        });
    },

    startFreeSession: () => {
        set({
            isRunning: true,
            isPaused: false,
            mode: 'free',
            timeRemaining: 0,
            timeElapsed: 0,
            startedAt: new Date().toISOString(),
        });
    },

    pause: () => {
        set({ isPaused: true });
    },

    resume: () => {
        set({ isPaused: false });
    },

    stop: () => {
        set({
            isRunning: false,
            isPaused: false,
            timeRemaining: DEFAULT_POMODORO_MINUTES * 60,
            timeElapsed: 0,
            startedAt: null,
        });
    },

    tick: () => {
        const { isRunning, isPaused, mode, timeRemaining, timeElapsed } = get();

        if (!isRunning || isPaused) return;

        if (mode === 'pomodoro') {
            if (timeRemaining <= 0) {
                set({ isRunning: false });
                return;
            }
            set({ timeRemaining: timeRemaining - 1 });
        } else {
            set({ timeElapsed: timeElapsed + 1 });
        }
    },

    setSelectedSprint: (sprintId) => {
        set({ selectedSprintId: sprintId });
    },
}));
