import { useQuery } from '@tanstack/react-query';
import { sessionsApi } from '../../api/endpoints';

interface SessionFilters {
    sprint_id?: number;
    date?: string;
    from?: string;
    to?: string;
}

export const sessionKeys = {
    all: ['sessions'] as const,
    filtered: (filters: SessionFilters) => ['sessions', filters] as const,
    detail: (id: number) => ['sessions', id] as const,
};

export function useSessions(filters?: SessionFilters) {
    return useQuery({
        queryKey: filters ? sessionKeys.filtered(filters) : sessionKeys.all,
        queryFn: () => sessionsApi.getAll(filters),
    });
}

export function useSession(id: number) {
    return useQuery({
        queryKey: sessionKeys.detail(id),
        queryFn: () => sessionsApi.getById(id),
        enabled: !!id,
    });
}
