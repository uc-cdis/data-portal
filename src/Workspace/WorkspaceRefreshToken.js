import { fetchWithCreds } from '../actions';
import { wtsPath } from '../localconf';

// start workspace session for WTS, call optional connectedCallBack if initialized/connected
export const initWorkspaceRefreshToken = (connectedCallBack) => {
    console.log('init/renew WTS refresh token...');
    fetchWithCreds({
      path: `${wtsPath}connected`,
      method: 'GET',
    })
      .then(
        ({ status }) => {
          if (status !== 200) {
            window.location.href = `${wtsPath}/authorization_url?redirect=${window.location.pathname}`;
          } else if (connectedCallBack) {
              connectedCallBack();
          }
        },
      );
  }
