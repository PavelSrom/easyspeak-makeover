/* eslint-disable no-restricted-imports */
import { requests } from 'backend'
import { UseQueryOptions, useQuery } from 'react-query'
import { Unpromisify } from 'types/helpers'

type QueryKeys = keyof typeof requests['query']

type PaginatedKey<K extends QueryKeys> = [K, ...(string | number | boolean)[]]

type ParamsOfQuery<K extends QueryKeys> = Parameters<
  typeof requests['query'][K]
>

export const useTypeSafeQuery = <K extends QueryKeys>(
  key: K | PaginatedKey<K>,
  opts?: UseQueryOptions<
    never,
    unknown,
    Unpromisify<ReturnType<typeof requests['query'][K]>>,
    ParamsOfQuery<K>
  > | null,
  ...params: ParamsOfQuery<K>
) =>
  useQuery<Unpromisify<ReturnType<typeof requests['query'][K]>>>(
    key,
    () => {
      const fn = requests.query[typeof key === 'string' ? key : key[0]] as any
      return fn(...(params || []))
    },
    opts as any
  )
