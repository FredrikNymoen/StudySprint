import { useQuery } from '@tanstack/react-query';
import { goalsApi } from '../../api/endpoints';

export const goalKeys = {
    all: ['goals'] as const,
    bySprint: (sprintId: number) => ['goals', 'sprint', sprintId] as const,
};

export function useGoals(sprintId?: number) {
    return useQuery({
        queryKey: sprintId ? goalKeys.bySprint(sprintId) : goalKeys.all,
        queryFn: () => goalsApi.getAll(sprintId),
    });
}
