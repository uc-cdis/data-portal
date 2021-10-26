import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { LoginOutlined, ReloadOutlined } from '@ant-design/icons';
import { externalLoginOptionsUrl } from '../localconf';
import { fetchWithCreds } from '../actions';
import './ExternalLogins.less';

interface ExternalProvider {
    'base_url': string,
    'idp': string,
    'name': string,
    'refresh_token_expiration': string,
    'urls': {
        'name': string,
        'url': string,
    }[]
}

const ExternalLogins: React.FunctionComponent = () => {
  const [externalLoginOptions, setExternalLoginOptions] = useState([]);

  useEffect(
    () => {
      fetchWithCreds({
        path: `${externalLoginOptionsUrl}`,
        method: 'GET',
      }).then(
        ({ data }) => {
          setExternalLoginOptions((data.providers || []));
        },
      ).catch(() => setExternalLoginOptions([]));
    },
    [],
  );

  return (
    <React.Fragment>
      <h2>Link accounts from external data resource(s)</h2>
      <div className='external-logins'>
        { (externalLoginOptions).map(
          (provider: ExternalProvider, i: number) => (
            <div className='external-login-option' key={i}>
              <div className='external-login-option__description'>
                <h4> {provider.name} </h4>
                <p> IDP: {provider.idp} </p>
                <p> Provider URL: <a href={provider.base_url} target='_blank' rel='noreferrer'>{provider.base_url}</a></p>
                <p> Status: {
                  provider.refresh_token_expiration
                    ? `expires in ${provider.refresh_token_expiration}`
                    : 'not authorized'
                }
                </p>
              </div>
              <div className='external-login-option__sign-in-buttons'>
                {
                  provider.urls.map(
                    (providerUrl, j) => (
                      <Button
                        key={`${i}-${j}`}
                        className='external-login-option__button'
                        icon={
                          provider.refresh_token_expiration ? <ReloadOutlined /> : <LoginOutlined />
                        }
                        onClick={() => {
                          const providerLoginUrl = providerUrl.url;
                          const queryChar = providerLoginUrl.includes('?') ? '&' : '?';
                          window.location.href = `${providerLoginUrl}${queryChar}redirect=${window.location.pathname}`;
                        }}
                      >
                        { provider.refresh_token_expiration ? `Refresh ${providerUrl.name}` : `Authorize ${providerUrl.name}` }
                      </Button>
                    ),
                  )
                }
              </div>
            </div>
          ),
        ) }
      </div>
    </React.Fragment>
  );
};

export default ExternalLogins;
