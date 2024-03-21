  interface ListItem {
    title: string;
    description: string;
    guid: string;
  }

  interface LinkItem {
    title?: string;
    link: string;
  }

  interface User {
    username: string;
    fence_idp?: string; // eslint-disable-line camelcase
  }

export {
  ListItem, LinkItem, User,
};
