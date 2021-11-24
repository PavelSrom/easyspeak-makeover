export type Unpromisify<T> = T extends Promise<infer U> ? U : T

export type ApiResponse<T> = T extends Promise<infer U>
  ? U extends void
    ? never
    : U
  : never
