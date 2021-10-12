import React, { useState, useEffect } from 'react';
import { externalLoginOptionsUrl } from '../localconf'
import { fetchWithCreds } from '../actions'
import { Button,  } from 'antd';
import { LoginOutlined, ReloadOutlined } from '@ant-design/icons'
import './ExternalLogins.less'

interface ExternalProvider {
    "base_url": string,
    "idp": string,
    "name": string,
    "refresh_token_expiration": string,
    "urls": {
        "name": string,
        "url": string,
    }[]
};

const externalProviderElement = (provider: ExternalProvider) => <div className='external-login-option'>
    <div className="external-login-option__description">
        <h4> {provider.name} </h4>
        <p> IDP: {provider.idp} </p>
        <a href={provider.base_url} target="_blank">{provider.base_url}</a>
        <div>{
            provider.refresh_token_expiration ?
            `Expires in ${provider.refresh_token_expiration}` :
            "Not yet authorized"
        }</div>
    </div>
    <div className="external-login-option__sign-in-buttons">
        {
            provider.urls.map(
                providerUrl => <Button
                    className="external-login-option__button"
                    icon={
                        provider.refresh_token_expiration ? <ReloadOutlined/> : <LoginOutlined />
                    }
                    onClick={()=>{
                        const providerLoginUrl = providerUrl.url;
                        const queryChar = providerLoginUrl.includes('?') ? '&' : '?';
                        window.location.href = `${providerLoginUrl}${queryChar}redirect=${window.location.pathname}`;
                    }}
                >
                    { provider.refresh_token_expiration ? `Refresh ${providerUrl.name}` : `Authorize ${providerUrl.name}` }
                </Button>
            )
        }
    </div>
</div>

const externalLogins: React.FunctionComponent = () => {

    const [externalLoginOptions, setExternalLoginOptions] = useState([]);

    useEffect(() => {
        fetchWithCreds({
            path: `${externalLoginOptionsUrl}`,
            method: 'GET',
        }).then(
            ({ data }) => {
              setExternalLoginOptions(data.providers);
            },
        );
    });

    return <React.Fragment>
        <h2>Link accounts from external data resource(s)</h2>
        <div className='external-logins'>
            { externalLoginOptions.map(externalProviderElement) }
        </div>
    </React.Fragment>
}

export default externalLogins;
