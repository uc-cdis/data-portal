import { createAsyncThunk } from '@reduxjs/toolkit';
import { config } from '../../params';
import { authzPath } from '../../localconf';

export const fetchUserAccess = createAsyncThunk(
  'userAccess/fetchUserAccess',
  async () => {
    /**
     * restricted access components and their associated arborist resources:
     * @type {{ [name: string]: { [key: string]: string } }}
     */
    const resourceMapping = config.componentToResourceMapping || {};
    const resourceNames = Object.keys(resourceMapping);

    const userAccessResults = await Promise.all(
      resourceNames.map(async (name) => {
        const { resource, method, service } = resourceMapping[name];
        const { status } = await fetch(
          `${authzPath}?resource=${resource}&method=${method}&service=${service}`
        );

        if (status === 200) return true;
        if (status !== 401 && status !== 403)
          console.error(`Unknown status "${status}" returned by arborist call`);

        return false;
      })
    );

    /** @type {import('../types').RootState['userAccess']} */
    const userAccess = {};
    for (const [i, hasAccess] of userAccessResults.entries())
      userAccess[resourceNames[i]] = hasAccess;

    return userAccess;
  }
);
