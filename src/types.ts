export interface BuxiosRequestConfig {
  url?: string;
  method?: string;
  data?: any;
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface BuxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: BuxiosRequestConfig;
}

export interface BuxiosInstance {
  get<T = any>(
    url: string,
    config?: BuxiosRequestConfig,
  ): Promise<BuxiosResponse<T>>;
  post<T = any>(
    url: string,
    data?: any,
    config?: BuxiosRequestConfig,
  ): Promise<BuxiosResponse<T>>;
}

export type RequestInterceptorSuccessFn = (
  config: BuxiosRequestConfig,
) => BuxiosRequestConfig | Promise<BuxiosRequestConfig>;

export type ResponseInterceptorSuccessFn<T = any> = (
  value: BuxiosResponse<T>,
) => BuxiosResponse<T> | Promise<BuxiosResponse<T>>;

export type InterceptorFailFn<T = any> = (error: any) => T | Promise<T>;

export interface RequestInterceptor {
  successFn: RequestInterceptorSuccessFn;
  failFn?: InterceptorFailFn<BuxiosRequestConfig>;
}

export interface ResponseInterceptor<T = any> {
  successFn: ResponseInterceptorSuccessFn<T>;
  failFn?: InterceptorFailFn<BuxiosResponse<T>>;
}
