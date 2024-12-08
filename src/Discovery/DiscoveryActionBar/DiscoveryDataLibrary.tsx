import React, { useState, useEffect } from 'react';
import { Space, Button, notification } from 'antd';
import ComboboxWithInput from '../../components/ComboboxWithInput';
import { DiscoveryConfig } from '../DiscoveryConfig';
import { userDataLibraryUrl } from '../../localconf';
import { fetchWithCreds } from '../../actions';
import { User } from './DiscoveryActionBarInterfaces';

interface ComboboxItem {
  value: string;
  label: string;
}

type NotificationType = 'success' | 'warning' | 'error';

const postNotification = (description: string, type:NotificationType) => {
  notification[type]({
    message: 'Data Library',
    description,
  });
};

const extractListNameAndId = (data:any) : ComboboxItem[] => Object.keys(data).map((id) => ({ value: id, label: data[id].name }));

const updateList = async (list: { name: string, items: any[] }, listId: string = undefined) => {
  try {
    const response = await fetchWithCreds({
      path: listId ? `${userDataLibraryUrl}/lists/${listId}` : `${userDataLibraryUrl}/lists`,
      method: 'PUT',
      customHeaders: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listId ? list : { lists: [list] }),
    });
    switch (response.status) {
    case 200:
    case 201:
      postNotification(listId ? 'List contents have been updated.' : 'List has been created.', 'success');
      break;
    case 401:
      postNotification('Not Authorized. Please log in', 'error');
      break;
    case 409:
      postNotification('Selection is already in a list. Please choose a different selection.', 'warning');
      break;
    default: {
      postNotification('Unknown error. Please try again later.', 'error');
    }
    }
  } catch (error) {
    postNotification('Unknown error. Please try again later.', 'error');
  }
};

/* eslint react/prop-types: 0 */
interface Props {
    config: DiscoveryConfig;
    // eslint-disable-next-line react/no-unused-prop-types
    user: User;
    discovery: {
        selectedResources: any[];
    };
  healIDPLoginNeeded: string[];
}

const DiscoveryDataLibrary = (props: Props) => {
  const [data, setData] = useState<ComboboxItem[]>([]);
  const [currentList, setCurrentList] = useState<ComboboxItem>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { config: { features: { exportToDataLibrary } }, discovery: { selectedResources }, healIDPLoginNeeded } = props;

  const onChangeListSelection = (listname: string, listId: string) => {
    setCurrentList({ label: listname, value: listId });
  };

  const saveToList = (listname: string, listId: string = undefined) => {
    if (selectedResources.length === 0) return;
    const items = selectedResources.reduce((acc, resource) => {
      const dataObjects = resource[exportToDataLibrary.dataObjectFieldName];
      const datasetId = resource[exportToDataLibrary.datesetIdFieldName];

      const datafiles = dataObjects.reduce((dataAcc, dataObject: any) => {
        const guid = dataObject[exportToDataLibrary.dataObjectIdField];
        return {
          ...dataAcc,
          [guid]: {
            dataset_guid: datasetId,
            ...dataObject,
          },
        };
      }, {});
      return {
        ...acc,
        ...datafiles,
      };
    }, {});

    try {
      updateList({
        name: listname,
        items,
      }, listId);
    } catch (err) {
      postNotification('Data Library update failed. Please try again later.', 'error');
    }
  };

  // fetch the list
  const fetchLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithCreds({ path: `${userDataLibraryUrl}/lists` });
      const jsonData = response.data;
      const listItems = extractListNameAndId(jsonData.lists);
      setData(listItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const notLoggedIn = !(props.user.username && !(healIDPLoginNeeded.length > 0));

  return (
    <React.Fragment>
      <Space size='small'>
        <ComboboxWithInput
          items={data}
          onChange={onChangeListSelection}
          placeholder={notLoggedIn ? 'Login to save to a list' : 'Select/create a list to save to'}
          disabled={notLoggedIn}
        />
        <Button
          loading={loading}
          type='primary'
          disabled={error !== null || loading || data?.length === 0 || currentList === undefined || selectedResources.length === 0 || notLoggedIn}
          onClick={() => {
            if (currentList) {
              saveToList(currentList.label, currentList.value);
            } else {
              saveToList(currentList.label);
              fetchLists();
            }
          }}
        > Save to List
        </Button>
      </Space>
    </React.Fragment>
  );
};

export default DiscoveryDataLibrary;
