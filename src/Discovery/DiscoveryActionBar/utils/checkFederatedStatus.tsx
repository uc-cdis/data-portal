import React from 'react';
import { Button, Table } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { fetchWithCreds } from '../../../actions';
import { externalLoginOptionsUrl } from '../../../localconf';
import { DownloadStatus } from '../DiscoveryActionBarInterfaces';
import { GUID_PREFIX_PATTERN } from '../DiscoveryActionBarConstants';

const checkFederatedLoginStatus = async (
  setDownloadStatus: (arg0: DownloadStatus) => void,
  selectedResources: any[],
  manifestFieldName: string,
  history,
  location,
) => fetchWithCreds({
  path: `${externalLoginOptionsUrl}`,
  method: 'GET',
})
  .then(async ({ data, status }) => {
    if (status !== 200) {
      return false;
    }
    const { providers } = data;
    const unauthenticatedProviders = providers.filter(
      (provider) => !provider.refresh_token_expiration,
    );

    const guidsForHostnameResolution: any = [];
    const guidPrefixes: any = [];
    selectedResources.forEach((selectedResource) => {
      (selectedResource[manifestFieldName] || []).forEach((fileMetadata) => {
        if (fileMetadata.object_id) {
          const guidDomainPrefix = (
            fileMetadata.object_id.match(GUID_PREFIX_PATTERN) || []
          ).shift();
          if (guidDomainPrefix) {
            if (!guidPrefixes.includes(guidDomainPrefix)) {
              guidPrefixes.push(guidDomainPrefix);
              guidsForHostnameResolution.push(fileMetadata.object_id);
            }
          } else {
            guidsForHostnameResolution.push(fileMetadata.object_id);
          }
        }
      });
    });
    const guidResolutions = await Promise.all(
      guidsForHostnameResolution.map((guid) => fetch(`https://dataguids.org/index/${guid}`)
        .then((r) => r.json())
        .catch(() => {}),
      ),
    );
    const externalHosts = guidResolutions
      .filter(
        (resolvedGuid) => resolvedGuid && resolvedGuid.from_index_service,
      )
      .map(
        (resolvedGuid) => new URL(resolvedGuid.from_index_service.host).host,
      );
    const providersToAuthenticate = unauthenticatedProviders.filter(
      (unauthenticatedProvider) => externalHosts.includes(
        new URL(unauthenticatedProvider.base_url).hostname,
      ),
    );
    if (providersToAuthenticate.length) {
      setDownloadStatus({
        inProgress: false,
        message: {
          title: 'Authorization Required',
          active: true,
          content: (
            <React.Fragment>
              <p>
                    The data you have selected requires authorization with the
                    following data resources:
              </p>
              <Table
                dataSource={providersToAuthenticate}
                columns={[
                  { title: 'Name', dataIndex: 'name', key: 'name' },
                  { title: 'IDP', dataIndex: 'idp', key: 'idp' },
                ]}
                size={'small'}
                pagination={false}
              />
              <p>
                    Please authorize these resources at the top of the
                <Button
                  size={'small'}
                  type='link'
                  icon={<LinkOutlined />}
                  onClick={() => history.push('/identity', {
                    from: `${location.pathname}`,
                  })}
                >
                      profile page
                </Button>
              </p>
            </React.Fragment>
          ),
        },
      });
      return false;
    }
    return true;
  })
  .catch(() => false);

export default checkFederatedLoginStatus;
