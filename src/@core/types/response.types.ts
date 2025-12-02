export type TResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  error?: string;
  data?: T;
}
