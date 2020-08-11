declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG: boolean;
      MODE: string;
      CDN: string;
      BASE_URL: string;
      REQ_URL: string;
      WEB_CODE: string;
    }
  }
  var ppp: string;
}
declare namespace NodeJS {
  interface ProcessEnv {
    DEBUG: boolean;
    MODE: string;
    CDN: string;
    BASE_URL: string;
    REQ_URL: string;
    WEB_CODE: string;
  }
}

declare interface HTTPFunc {
  (): Promise<any>;
  cancel?(): void;
}

declare interface AxiosRequestConfig {
  retry?: number;
  retried?: number;
  retryDelay?: number;
}
