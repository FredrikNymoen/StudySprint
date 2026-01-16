import { apiClient } from '../client';
import type { WeeklyStats, StreakStats, SummaryStats } from '../../types';

export const statsApi = {
    getWeekly: () => apiClient.get<WeeklyStats>('/stats/weekly'),

    getStreaks: () => apiClient.get<StreakStats>('/stats/streaks'),

    getSummary: () => apiClient.get<SummaryStats>('/stats/summary'),
};
