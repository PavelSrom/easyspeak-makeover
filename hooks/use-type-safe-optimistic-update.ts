import { requests } from 'backend'
import { useCallback } from 'react'
import { Unpromisify } from 'types/helpers'
import { useTypeSafeQueryClient } from './use-type-safe-query-client'

type QueryKeys = keyof typeof requests['query']

type PaginatedKey<K extends QueryKeys> = [K, ...(string | number | boolean)[]]
type AwaitedReturnOfQuery<K extends QueryKeys> = Unpromisify<
  ReturnType<typeof requests['query'][K]>
>

export const useTypeSafeOptimisticUpdate = () => {
  const queryClient = useTypeSafeQueryClient()

  const optimisticUpdate = useCallback(
    async <K extends QueryKeys>(
      key: K | PaginatedKey<K>,
      updater: (
        oldData: AwaitedReturnOfQuery<K> | undefined
      ) => AwaitedReturnOfQuery<K> | undefined
    ): Promise<AwaitedReturnOfQuery<K> | undefined> => {
      await queryClient.cancelQueries(key)

      const prevData = queryClient.getQueryData<AwaitedReturnOfQuery<K>>(key)

      queryClient.setQueryData<AwaitedReturnOfQuery<K> | undefined>(
        key,
        updater
      )

      return prevData
    },
    [queryClient]
  )

  const rollback = useCallback(
    <K extends QueryKeys>(
      key: K | PaginatedKey<K>,
      prevData: AwaitedReturnOfQuery<K> | undefined
    ) => {
      queryClient.setQueryData<AwaitedReturnOfQuery<K> | undefined>(
        key,
        prevData
      )
    },
    [queryClient]
  )

  return { optimisticUpdate, rollback }
}
