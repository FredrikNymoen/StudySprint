import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../../api/endpoints';

export const statsKeys = {
    weekly: ['stats', 'weekly'] as const,
    streaks: ['stats', 'streaks'] as const,
    summary: ['stats', 'summary'] as const,
};

export function useWeeklyStats() {
    return useQuery({
        queryKey: statsKeys.weekly,
        queryFn: statsApi.getWeekly,
    });
}

export function useStreaks() {
    return useQuery({
        queryKey: statsKeys.streaks,
        queryFn: statsApi.getStreaks,
    });
}

export function useSummary() {
    return useQuery({
        queryKey: statsKeys.summary,
        queryFn: statsApi.getSummary,
    });
}
