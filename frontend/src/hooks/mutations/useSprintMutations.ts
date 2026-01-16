import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sprintsApi } from '../../api/endpoints';
import { sprintKeys } from '../queries';
import type { CreateSprintInput, UpdateSprintInput } from '../../types';

export function useCreateSprint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSprintInput) => sprintsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sprintKeys.all });
        },
    });
}

export function useUpdateSprint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateSprintInput }) =>
            sprintsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: sprintKeys.all });
            queryClient.invalidateQueries({ queryKey: sprintKeys.detail(id) });
        },
    });
}

export function useDeleteSprint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => sprintsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sprintKeys.all });
        },
    });
}
