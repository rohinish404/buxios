export interface BuxiosRequestConfig {
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

export interface InternalRequestConfig extends BuxiosRequestConfig {
  method?: "GET" | "POST";
  body?: any;
}

export interface DispatchRequestParams {
  url: string;
  config?: InternalRequestConfig;
}
