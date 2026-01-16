import { useQuery } from '@tanstack/react-query';
import { tagsApi } from '../../api/endpoints';

export const tagKeys = {
    all: ['tags'] as const,
};

export function useTags() {
    return useQuery({
        queryKey: tagKeys.all,
        queryFn: tagsApi.getAll,
    });
}
