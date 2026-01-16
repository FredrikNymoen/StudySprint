import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '../../api/endpoints';
import { tagKeys } from '../queries';

export function useCreateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => tagsApi.create(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagKeys.all });
        },
    });
}

export function useDeleteTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => tagsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagKeys.all });
        },
    });
}
