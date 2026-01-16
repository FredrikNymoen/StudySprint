import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '../../api/endpoints';
import { sessionKeys, statsKeys } from '../queries';
import type { CreateSessionInput, UpdateSessionInput } from '../../types';

export function useCreateSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSessionInput) => sessionsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.all });
            queryClient.invalidateQueries({ queryKey: statsKeys.weekly });
            queryClient.invalidateQueries({ queryKey: statsKeys.streaks });
            queryClient.invalidateQueries({ queryKey: statsKeys.summary });
        },
    });
}

export function useUpdateSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateSessionInput }) =>
            sessionsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.all });
            queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: statsKeys.weekly });
            queryClient.invalidateQueries({ queryKey: statsKeys.streaks });
            queryClient.invalidateQueries({ queryKey: statsKeys.summary });
        },
    });
}

export function useDeleteSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => sessionsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.all });
            queryClient.invalidateQueries({ queryKey: statsKeys.weekly });
            queryClient.invalidateQueries({ queryKey: statsKeys.streaks });
            queryClient.invalidateQueries({ queryKey: statsKeys.summary });
        },
    });
}
