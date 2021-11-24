import { requests } from 'backend'
import { useMutation, UseMutationOptions } from 'react-query'
import { Unpromisify } from 'types/helpers'

type Keys = keyof typeof requests['mutation']

export const useTypeSafeMutation = <K extends Keys>(
  key: K,
  opts?: UseMutationOptions<
    Unpromisify<ReturnType<typeof requests['mutation'][K]>>,
    any,
    Parameters<typeof requests['mutation'][K]>,
    any
  >
) =>
  useMutation<
    Unpromisify<ReturnType<typeof requests['mutation'][K]>>,
    any,
    Parameters<typeof requests['mutation'][K]>
  >(
    params =>
      (requests.mutation[typeof key === 'string' ? key : key[0]] as any)(
        ...params
      ),
    opts
  )
