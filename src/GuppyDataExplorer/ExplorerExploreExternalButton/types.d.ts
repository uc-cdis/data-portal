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
