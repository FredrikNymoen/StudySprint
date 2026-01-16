import { useQuery } from '@tanstack/react-query';
import { sprintsApi } from '../../api/endpoints';

export const sprintKeys = {
    all: ['sprints'] as const,
    detail: (id: number) => ['sprints', id] as const,
};

export function useSprints() {
    return useQuery({
        queryKey: sprintKeys.all,
        queryFn: sprintsApi.getAll,
    });
}

export function useSprint(id: number) {
    return useQuery({
        queryKey: sprintKeys.detail(id),
        queryFn: () => sprintsApi.getById(id),
        enabled: !!id,
    });
}
