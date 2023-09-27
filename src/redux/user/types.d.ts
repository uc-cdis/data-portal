import type { UserDocument } from '../UserPopup/types';

export type UserAuthz = {
  [path: string]: { method: string; service: string }[];
};

export type User = {
  additional_info: {
    firstName?: string;
    lastName?: string;
    institution?: string;
  };
  authz: UserAuthz;
  azp: any;
  certificates_uploaded: any[];
  display_name: string;
  docs_to_be_reviewed: UserDocument[];
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

type UserListItem = {
  name: srring,
  id: number,
  last_auth?: string,
  first_name?: string,
  last_name?: string,
  institution?: string,
  role?: string
}

export type UserState = Partial<User> & {
  fetch_error?: any;
  fetched_user?: boolean;
  admin_user_list?: UserListItem[]
  lastAuthMs?: number;
};
