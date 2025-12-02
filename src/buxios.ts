import type {
  BuxiosInstance,
  BuxiosRequestConfig,
  BuxiosResponse,
  InterceptorFailFn,
  RequestInterceptorSuccessFn,
  ResponseInterceptorSuccessFn,
  RequestInterceptor,
  ResponseInterceptor,
} from "./types";

class Buxios {
  config: BuxiosRequestConfig = {
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  };

  requestInterceptors: RequestInterceptor[] = [];
  responseInterceptors: ResponseInterceptor[] = [];
  constructor(config: BuxiosRequestConfig) {
    this.config = this.mergeConfig(config);
  }

  async request<T = any>(
    config: BuxiosRequestConfig,
  ): Promise<BuxiosResponse<T>> {
    const finalConfig = this.mergeConfig(config);

    let requestPromise = Promise.resolve(finalConfig);

    for (const { successFn, failFn } of this.requestInterceptors) {
      requestPromise = requestPromise.then(
        successFn,
        failFn || ((err) => Promise.reject(err)),
      );
    }

    let responsePromise = requestPromise.then(this.dispatchRequest.bind(this));

    for (const { successFn, failFn } of this.responseInterceptors) {
      responsePromise = responsePromise.then(
        successFn as any,
        failFn || ((err) => Promise.reject(err)),
      );
    }

    return responsePromise as Promise<BuxiosResponse<T>>;
  }

  private async dispatchRequest(config: BuxiosRequestConfig) {
    const finalConfig = this.mergeConfig(config);
    const timeout = finalConfig.timeout || 0;
    const abortController = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (timeout) {
      timeoutId = setTimeout(() => abortController.abort(), timeout);
    }

    try {
      const response = await fetch(`${finalConfig.baseURL}${finalConfig.url}`, {
        method: finalConfig.method || "GET",
        headers: finalConfig.headers,
        body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
        signal: abortController.signal,
      });
      return this.transformResponse(response, finalConfig);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
  async get<T>(
    url: string,
    config?: BuxiosRequestConfig,
  ): Promise<BuxiosResponse<T>> {
    return this.request({
      ...config,
      url,
      method: "GET",
    });
  }

  mergeConfig(config?: BuxiosRequestConfig): BuxiosRequestConfig {
    return {
      ...this.config,
      ...config,
      headers: {
        ...(this.config.headers || {}),
        ...(config?.headers || {}),
      },
    };
  }
  addRequestInterceptors(
    successFn: RequestInterceptorSuccessFn,
    failFn?: InterceptorFailFn,
  ) {
    this.requestInterceptors.push({ successFn, failFn });
  }
  addResponseInterceptors(
    successFn: ResponseInterceptorSuccessFn,
    failFn?: InterceptorFailFn,
  ) {
    this.responseInterceptors.push({ successFn, failFn });
  }

  private async transformResponse<T>(
    response: Response,
    config: BuxiosRequestConfig,
  ): Promise<BuxiosResponse<T>> {
    const data = (await response.json()) as T;
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config,
    };
  }
}
export function create(config: BuxiosRequestConfig) {
  return new Buxios(config);
}
