import type {
  BuxiosInstance,
  BuxiosRequestConfig,
  BuxiosResponse,
} from "./types";

class Buxios {
  config: BuxiosRequestConfig;
  constructor(config: BuxiosRequestConfig) {
    this.config = config;
  }
  async get<T>(url: string): Promise<BuxiosResponse<T>> {
    throw new Error("not implemented");
  }
}
export async function create(config: BuxiosRequestConfig) {
  return new Buxios(config);
}
