import type { Dispatch, ReturnType } from 'redux';
import type { UserReviewDocument } from './UserPopup/types';

export type FetchHelperOptions = {
  path: string;
  method?: string; // Default is "GET"
  body?: any; // Default is null
  customHeaders?: Headers;
  dispatch?: Dispatch;
  useCache?: boolean;
  signal?: AbortSignal;
};

export type FetchHelperResult = {
  data: any;
  headers?: Headers; // if not using cache
  response?: Response; // if not using cache
  status: number;
};

export type UserAuthz = {
  [path: string]: { method: string; service: string }[];
};

export type User = {
  additional_info: Object;
  authz: UserAuthz;
  azp: any;
  certificates_uploaded: any[];
  display_name: string;
  docs_to_be_reviewed: UserReviewDocument[];
  email: string;
  ga4gh_passport_v1: any[];
  groups: any[];
  idp: string;
  is_admin: boolean;
  message: string;
  name: string;
  phone_number: string;
  preferred_username: string;
  primary_google_service_account: any;
  project_access: Object;
  resources_granted: any[];
  role: string;
  sub: string;
  user_id: number;
  username: string;
};

export type UserState = Partial<User> & {
  fetch_error?: any;
  fetched_user?: boolean;
  lastAuthMs?: number;
};

export type UserAccessState = {
  access?: { [name: string]: boolean };
};

export type ProjectState = {
  projects?: Object;
  projectAvail?: Object;
};

export type VersionInfoState = {
  dataVersion: string;
  dictionaryVersion: string;
  portalVersion: string;
};

export type StatusState = {
  request_state?: string;
  error_type?: string;
};

export type KubeState = {
  job: {
    status: string;
    uid: string;
  };
  jobStatusInterval: number;
  resultURL: string;
};
