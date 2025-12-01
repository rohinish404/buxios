import type {
  BuxiosInstance,
  BuxiosRequestConfig,
  BuxiosResponse,
} from "./types";

class Buxios {
  config: BuxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  constructor(config: BuxiosRequestConfig) {
    this.config = this.mergeConfig(config);
  }
  async get<T>(url: string, config?: BuxiosRequestConfig) {
    const finalConfig = this.mergeConfig(config);
    return fetch(`${this.config.baseURL}${url}`, finalConfig);
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
