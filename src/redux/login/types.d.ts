export type LoginProvider = {
  desc?: string;
  id?: string; // deprecated; use idp
  idp: string;
  name: string;
  secondary?: boolean;
  url?: string; // deprecated; use urls
  urls: { name: string; url: string }[];
};

export type LoginState = {
  providers: LoginProvider[];
  error: any;
};
