import { useIsFetching, useIsMutating } from '@tanstack/react-query';

/**
 * useGlobalLoading({
 *   fetching: { queryKey: ['users'] },
 *   mutating: { mutationKey: ['users'] },
 * })
 *
 * @param options
 * @returns {boolean}
 */
export default function useGlobalLoading(options = {}) {
    const isFetchingCount = useIsFetching(options.fetching)
    const isMutatingCount = useIsMutating(options.mutating)

    return isFetchingCount > 0 || isMutatingCount > 0
}
