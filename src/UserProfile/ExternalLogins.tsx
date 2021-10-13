import React, { useState, useEffect } from 'react';
import { externalLoginOptionsUrl } from '../localconf'
import { fetchWithCreds } from '../actions'
import { Button, Space } from 'antd';
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
            { externalLoginOptions.map(
                (provider: ExternalProvider, i: number) => (
                    <div className='external-login-option' key={i}>
                        <div className="external-login-option__description">
                            <h4> {provider.name} </h4>
                            <Space> IDP: {provider.idp} </Space>
                            <Space>Provider URL: <a href={provider.base_url} target="_blank">{provider.base_url}</a></Space>
                            <Space>Status:{
                                provider.refresh_token_expiration ?
                                `expires in ${provider.refresh_token_expiration}` :
                                "not authorized"
                            }</Space>
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
                )
             ) }
        </div>
    </React.Fragment>
}

export default externalLogins;
