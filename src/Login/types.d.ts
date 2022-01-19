export type LoginData = {
  contact_link?: { href: string; text?: string };
  contact?: string;
  email?: string;
  subTitle: string;
  text: string;
  title: string;
};

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
