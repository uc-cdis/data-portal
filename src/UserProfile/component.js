import React from 'react';
import { jsonToString, getSubmitPath } from '../utils';
import { updatePopup } from '../actions';
import { Popup, SavePopup } from '../Popup/component';
import { connect } from 'react-redux';
import { fetchAccess, createKey, deleteKey,
  requestDeleteKey, clearDeleteSession, clearCreationSession } from './actions';
import { RequestButton, DeleteButton, Bullet, ProjectCell, RightCell, AccessKeyCell, ActionCell, Cell,
  AccessKeyHeader, ProjectHeader, RightHeader, KeyPairTable } from './style';
import { credentialCdisPath } from '../localconf';
import { DivTable } from '../theme';
import * as constants from './constants';

const KeyPairsEntity = ({ keypairs_api, value, onUpdatePopup, onRequestDeleteKey }) => {
  const onDelete = () => {
    onRequestDeleteKey(value.access_key, keypairs_api);
    onUpdatePopup({ key_delete_popup: true, keypairs_api });
  };
  return (
    <li>
      <Bullet>
        <AccessKeyCell>{value.access_key}</AccessKeyCell>
        <ActionCell>
          <DeleteButton onClick={onDelete}>
            {constants.DELETE_BTN}
          </DeleteButton>
        </ActionCell>
      </Bullet>
    </li>
  );
};

const KeyPairsEntities = ({ values, keypairs_api, onUpdatePopup, onRequestDeleteKey }) => (
  <ul>
    {values.length > 0 && <li>
      <AccessKeyHeader>{constants.ACCESS_KEY_COLUMN}</AccessKeyHeader>
    </li>}
    {values.map(item =>
      (<KeyPairsEntity
        key={item.access_key} keypairs_api={keypairs_api}
        value={item} onUpdatePopup={onUpdatePopup}
        onRequestDeleteKey={onRequestDeleteKey}
      />))}
  </ul>
);

export const IdentityComponent = ({ user, user_profile, popups, submission, onCreateKey,
  onClearCreationSession, onUpdatePopup, onDeleteKey,
  onRequestDeleteKey, onClearDeleteSession }) => {
  const onCreate = () => {
    onCreateKey(credentialCdisPath);
  };
  const accessible_projects = Object.keys(user.project_access);
  return (
    <div>
      {
        user_profile.access_key_pairs === undefined &&
        <div>
          {constants.NO_ACCESS_MSG}
        </div>
      }
      {
        user_profile.access_key_pairs !== undefined && user_profile.access_key_pairs !== [] &&
        <KeyPairTable>
          {
            popups.key_delete_popup === true &&
            <Popup
              message={constants.CONFIRM_DELETE_MSG}
              error={jsonToString(user_profile.delete_error)}
              onConfirm={() => onDeleteKey(user_profile.request_delete_key,
                popups.keypairs_api)}
              onCancel={() => {
                onClearDeleteSession();
                onUpdatePopup({ key_delete_popup: false });
              }}
            />
          }
          {
            popups.save_key_popup === true &&
            <SavePopup
              message={constants.SECRET_KEY_MSG}
              error={jsonToString(user_profile.create_error)}
              display={user_profile.access_key_pair}
              savingStr={user_profile.str_access_key_pair}
              onClose={() => {
                onUpdatePopup({ save_key_popup: false });
                onClearCreationSession();
              }}
              filename={'accessKeys.txt'}
            />
          }
          <RequestButton onClick={onCreate}>
            {constants.CREATE_ACCESS_KEY_BTN}
          </RequestButton>
          {
            user_profile.access_key_pairs.length === 0 &&
            <div>
              {constants.NO_ACCESS_KEY}
            </div>
          }
          {
            user_profile.access_key_pairs.length > 0 &&
            <h5>
              {constants.LIST_ACCESS_KEY_MSG}
            </h5>
          }
          {
            user_profile.access_key_pairs &&
            <KeyPairsEntities
              key="list_access_id"
              values={user_profile.access_key_pairs}
              keypairs_api={credentialCdisPath}
              onUpdatePopup={onUpdatePopup}
              onRequestDeleteKey={onRequestDeleteKey}
            />
          }
        </KeyPairTable>
      }
      <DivTable>
        <ul>
          <h5>{constants.LIST_PROJECT_MSG}</h5>
          <li>
            <Bullet>
              <ProjectHeader>{constants.PROJECT_COLUMN}</ProjectHeader>
              <RightHeader>{constants.RIGHT_COLUMN}</RightHeader>
            </Bullet>
          </li>
          {accessible_projects.map(
            (p, i) =>
              (<li key={4 * i}>
                <Bullet key={4 * i + 1}>
                  {
                    p in submission.projects &&
                    <ProjectCell key={4 * i + 2} to={`/${submission.projects[p]}`}>
                      {p}
                    </ProjectCell>
                  }
                  {
                    !(p in submission.projects) &&
                    <ProjectCell key={4 * i + 2}>
                      {p}
                    </ProjectCell>
                  }
                  <RightCell key={4 * i + 3}>
                    {user.project_access[p].join(', ')}
                  </RightCell>
                </Bullet>
              </li>),
          )}
        </ul>
      </DivTable>
    </div>
  );
};


const mapStateToProps = state => ({
  user: state.user,
  user_profile: state.user_profile,
  popups: state.popups,
  submission: state.submission,
});

const mapDispatchToProps = dispatch => ({
  onCreateKey: keypairs_api => dispatch(createKey(keypairs_api)),
  onUpdatePopup: state => dispatch(updatePopup(state)),
  onDeleteKey: (access_key, keypairs_api) =>
    dispatch(deleteKey(access_key, keypairs_api)),
  onRequestDeleteKey: (access_key, keypairs_api) =>
    dispatch(fetchAccess(keypairs_api)).then(
      () => dispatch(requestDeleteKey(access_key)),
    ),
  onClearDeleteSession: () => dispatch(clearDeleteSession()),
  onClearCreationSession: () => dispatch(clearCreationSession()),
});

const UserProfile = connect(mapStateToProps, mapDispatchToProps)(IdentityComponent);
export default UserProfile;
