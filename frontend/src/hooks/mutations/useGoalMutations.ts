import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../../api/endpoints';
import { goalKeys, sprintKeys } from '../queries';
import type { CreateGoalInput, UpdateGoalInput } from '../../types';

export function useCreateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGoalInput) => goalsApi.create(data),
        onSuccess: (_, { sprint_id }) => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
            queryClient.invalidateQueries({ queryKey: goalKeys.bySprint(sprint_id) });
            queryClient.invalidateQueries({ queryKey: sprintKeys.all });
        },
    });
}

export function useUpdateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateGoalInput }) =>
            goalsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
            queryClient.invalidateQueries({ queryKey: sprintKeys.all });
        },
    });
}

export function useDeleteGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => goalsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
            queryClient.invalidateQueries({ queryKey: sprintKeys.all });
        },
    });
}
