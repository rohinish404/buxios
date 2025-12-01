import type {
  BuxiosInstance,
  BuxiosRequestConfig,
  BuxiosResponse,
  DispatchRequestParams,
} from "./types";

class Buxios {
  config: BuxiosRequestConfig = {
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  };
  constructor(config: BuxiosRequestConfig) {
    this.config = this.mergeConfig(config);
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
    return this.dispatchRequest({ url, config: { ...config, method: "GET" } });
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
}
export function create(config: BuxiosRequestConfig) {
  return new Buxios(config);
}
