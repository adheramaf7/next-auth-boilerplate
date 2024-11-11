interface IBaseResponse<T> {
  data: T,
  status: "success" | "error" | undefined,
  message: string?
}