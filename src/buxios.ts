import type {
  BuxiosInstance,
  BuxiosRequestConfig,
  BuxiosResponse,
  DispatchRequestParams,
  InternalRequestConfig,
} from "./types";

class Buxios {
  config: BuxiosRequestConfig = {
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  };

  requestInterceptors = [];
  responseInterceptors = [];
  constructor(config: BuxiosRequestConfig) {
    this.config = this.mergeConfig(config);
  }

  async request({ url, config }: DispatchRequestParams) {
    const finalConfig = this.mergeConfig(config);

    const chain = [
      ...this.requestInterceptors,
      { successFn: this.dispatchRequest.bind(this) },
      ...this.responseInterceptors,
    ];

    let promise = Promise.resolve({ url, config: finalConfig });

    for (const { successFn, failFn } of chain) {
      promise = promise.then(
        (res) => {
          try {
            return successFn(res);
          } catch (err) {
            if (failFn) {
              return failFn(err);
            }
            return Promise.reject(err);
          }
        },
        (err) => {
          if (failFn) {
            return failFn(err);
          }
          return Promise.reject(err);
        },
      );
    }
    return promise;
  }

  private async dispatchRequest({ url, config }: DispatchRequestParams) {
    const finalConfig = this.mergeConfig(config);
    const timeout = finalConfig.timeout || 0;
    const abortController = new AbortController();
    let timeoutId;
    if (timeout) {
      timeoutId = setTimeout(() => abortController.abort(), timeout);
    }

    try {
      const response = await fetch(`${this.config.baseURL}${url}`, {
        ...finalConfig,
        signal: abortController.signal,
      });
      return response;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
  async get<T>(url: string, config?: BuxiosRequestConfig) {
    return this.request({ url, config: { ...config, method: "GET" } });
  }

  mergeConfig(config?: BuxiosRequestConfig) {
    return {
      ...this.config,
      ...config,
      headers: {
        ...(this.config.headers || {}),
        ...(config?.headers || {}),
      },
    };
  }
  addRequestInterceptors(successFn, failFn) {
    this.requestInterceptors.push({ successFn, failFn });
  }
  addResponseInterceptors(successFn, failFn) {
    this.responseInterceptors.push({ successFn, failFn });
  }
}
export function create(config: BuxiosRequestConfig) {
  return new Buxios(config);
}
