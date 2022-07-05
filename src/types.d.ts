export type FetchHelperOptions = {
  path: string;
  body?: any; // Default is null
  customHeaders?: Headers;
  method?: string; // Default is "GET"
  onError?: () => void;
  signal?: AbortSignal;
  useCache?: boolean;
};

export type FetchHelperResult = {
  data: any;
  headers?: Headers; // if not using cache
  response?: Response; // if not using cache
  status: number;
};
