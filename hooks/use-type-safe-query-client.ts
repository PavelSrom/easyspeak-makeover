import { requests } from 'backend'
import {
  InvalidateOptions,
  InvalidateQueryFilters,
  QueryClient,
  useQueryClient,
} from 'react-query'

type QueryKeys = keyof typeof requests['query']

type PaginatedKey<K extends QueryKeys> = [K, ...(string | number | boolean)[]]

type TypeSafeQueryClient = Omit<QueryClient, 'invalidateQueries'> & {
  // Original types are
  // invalidateQueries(filters?: InvalidateQueryFilters, options?: InvalidateOptions): Promise<void>;
  // invalidateQueries(queryKey?: QueryKey, filters?: InvalidateQueryFilters, options?: InvalidateOptions): Promise<void>;
  invalidateQueries<K extends QueryKeys>(
    key: K | PaginatedKey<K>,
    filters?: InvalidateQueryFilters,
    options?: InvalidateOptions
  ): void
  invalidateQueries(
    filters?: InvalidateQueryFilters,
    options?: InvalidateOptions
  ): Promise<void>
}

export const useTypeSafeQueryClient = (): TypeSafeQueryClient =>
  useQueryClient()
