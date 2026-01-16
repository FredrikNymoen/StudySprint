// Sprint types
export interface Sprint {
    id: number;
    title: string;
    description: string | null;
    deadline: string | null;
    created_at: string;
    completed: number;
    total_goals?: number;
    completed_goals?: number;
}

export interface CreateSprintInput {
    title: string;
    description?: string;
    deadline?: string;
}

export interface UpdateSprintInput {
    title?: string;
    description?: string;
    deadline?: string;
    completed?: number;
}

// Session types
export interface Session {
    id: number;
    sprint_id: number | null;
    type: 'pomodoro' | 'free';
    duration_minutes: number;
    started_at: string;
    ended_at: string | null;
    notes: string | null;
    tags: string[];
}

export interface CreateSessionInput {
    sprint_id?: number;
    type: 'pomodoro' | 'free';
    duration_minutes: number;
    started_at: string;
    ended_at?: string;
    notes?: string;
    tags?: string[];
}

export interface UpdateSessionInput {
    sprint_id?: number;
    type?: 'pomodoro' | 'free';
    duration_minutes?: number;
    started_at?: string;
    ended_at?: string;
    notes?: string;
    tags?: string[];
}

// Tag types
export interface Tag {
    id: number;
    name: string;
    usage_count?: number;
}

// Goal types
export interface Goal {
    id: number;
    sprint_id: number;
    description: string;
    completed: number;
}

export interface CreateGoalInput {
    sprint_id: number;
    description: string;
}

export interface UpdateGoalInput {
    description?: string;
    completed?: number;
}

// Stats types
export interface DayStats {
    date: string;
    session_count: number;
    total_minutes: number;
    pomodoro_count: number;
    free_count: number;
}

export interface WeeklyStats {
    period: {
        from: string;
        to: string;
    };
    days: DayStats[];
    totals: {
        sessions: number;
        minutes: number;
        hours: number;
    };
}

export interface StreakStats {
    current_streak: number;
    best_streak: number;
    last_session_date: string | null;
}

export interface SummaryStats {
    sessions: {
        total: number;
        total_minutes: number;
        total_hours: number;
        days_studied: number;
    };
    sprints: {
        total: number;
        completed: number;
    };
    goals: {
        total: number;
        completed: number;
    };
}
