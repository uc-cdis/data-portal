export type ExternalCommonsInfo =
  | {
      data: string;
      link: string;
      type: 'file';
    }
  | {
      data?: never;
      link: string;
      type: 'redirect';
    };

type CommonsDict = {
  [key: string]: string;
};
type Commons = {
  label: string;
  value: string;
};
export type ExternalConfig = {
  commons: Commons[];
  commons_dict: CommonsDict;
};
