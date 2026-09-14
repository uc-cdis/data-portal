import { initialize, mswLoader } from 'msw-storybook-addon';

initialize();

export const loaders = [mswLoader];
