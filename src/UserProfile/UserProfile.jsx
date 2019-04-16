import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import copy from 'clipboard-plus';
import Button from '@gen3/ui-component/dist/components/Button';
import { jsonToString } from '../utils';
import Popup from '../components/Popup';
import { credentialCdisPath } from '../localconf';
import KeyTable from '../components/tables/KeyTable';
import AccessTable from '../components/tables/AccessTable';
import './UserProfile.less';

const NO_ACCESS_MSG = 'You have no access to storage service. Please contact an admin to get it!';
const NO_API_KEY = 'You don\'t have any API key. Please create one!';
const CONFIRM_DELETE_MSG = 'Are you sure you want to make this key inactive?';
const SECRET_KEY_MSG = 'This secret key is only displayed this time. Please save it!';
export const CREATE_API_KEY_BTN = 'Create API key';

export const saveToFile = (savingStr, filename) => {
  const blob = new Blob([savingStr], { type: 'text/json' });
  FileSaver.saveAs(blob, filename);
};

const UserProfile = ({ user, userProfile, popups, submission, onCreateKey,
  onClearCreationSession, onUpdatePopup, onDeleteKey,
  onRequestDeleteKey, onClearDeleteSession }) => {
  const onCreate = () => {
    onCreateKey(credentialCdisPath);
  };

  const savePopupClose = () => {
    onUpdatePopup({ saveTokenPopup: false });
    onClearCreationSession();
  };

  const createPopupClose = () => {
    onClearDeleteSession();
    onUpdatePopup({ deleteTokenPopup: false });
  };

  return (
    <div className='user-profile'>
      {
        userProfile.jtis === undefined &&
        <div>
          {NO_ACCESS_MSG}
        </div>
      }
      {
        userProfile.jtis !== undefined && userProfile.jtis !== [] &&
        <ul className='user-profile__key-pair-table'>
          {
            popups.deleteTokenPopup === true &&
            <Popup
              message={CONFIRM_DELETE_MSG}
              error={jsonToString(userProfile.delete_error)}
              iconName='cross-key'
              title='Inactivate API Key'
              leftButtons={[
                {
                  caption: 'Cancel',
                  fn: createPopupClose,
                },
              ]}
              rightButtons={[
                {
                  caption: 'Confirm',
                  fn: () => onDeleteKey(
                    userProfile.requestDeleteJTI,
                    userProfile.requestDeleteExp,
                    popups.keypairsApi,
                  ),
                },
              ]}
              onClose={createPopupClose}
            />
          }
          {
            popups.saveTokenPopup === true &&
            <Popup
              message={SECRET_KEY_MSG}
              error={jsonToString(userProfile.create_error)}
              lines={[
                { label: 'Key id:', code: userProfile.refreshCred.key_id },
                {
                  label: 'API key:',
                  code: userProfile.refreshCred.api_key.replace(/./g, '*'),
                },
              ]}
              iconName='key'
              title='Created API Key'
              leftButtons={[
                {
                  caption: 'Close',
                  fn: savePopupClose,
                },
              ]}
              rightButtons={[
                {
                  caption: 'Download json',
                  fn: () => saveToFile(userProfile.strRefreshCred, 'credentials.json'),
                  icon: 'download',
                },
                {
                  caption: 'Copy',
                  fn: () => copy(userProfile.strRefreshCred),
                  icon: 'copy',
                },
              ]}
              onClose={savePopupClose}
            />
          }
          <Button
            onClick={onCreate}
            label={CREATE_API_KEY_BTN}
            buttonType='primary'
            rightIcon='key'
          />
          {
            userProfile.jtis.length === 0 &&
            <div>
              {NO_API_KEY}
            </div>
          }
          {
            userProfile.jtis &&
            <KeyTable
              jtis={userProfile.jtis}
              onDelete={
                (jti) => {
                  onRequestDeleteKey(jti.jti, jti.exp, credentialCdisPath);
                  onUpdatePopup({ deleteTokenPopup: true, keypairsApi: credentialCdisPath });
                }
              }
            />
          }
        </ul>
      }
      <AccessTable projects={submission.projects} projectsAccesses={user.project_access} />
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  popups: PropTypes.object.isRequired,
  submission: PropTypes.object,
  onClearCreationSession: PropTypes.func.isRequired,
  onCreateKey: PropTypes.func.isRequired,
  onUpdatePopup: PropTypes.func.isRequired,
  onDeleteKey: PropTypes.func.isRequired,
  onRequestDeleteKey: PropTypes.func.isRequired,
  onClearDeleteSession: PropTypes.func.isRequired,
};

UserProfile.defaultProps = {
  submission: {},
};

export default UserProfile;
