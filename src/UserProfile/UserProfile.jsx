import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router';

import { jsonToString } from '../utils';
import Popup from '../Popup/Popup';
import SavePopup from '../Popup/SavePopup';
import { button } from '../theme';
import { credentialCdisPath } from '../localconf';

const NO_ACCESS_MSG = 'You have no access to storage service. Please contact an admin to get it!';
const NO_ACCESS_KEY = 'You don\'t have any access key. Please create one!';
const CONFIRM_DELETE_MSG = 'Are you sure you want to make this key inactive?';
const SECRET_KEY_MSG = 'This secret key is only displayed this time. Please save it!';
const DELETE_BTN = 'Delete';
const CREATE_ACCESS_KEY_BTN = 'Create access key';
const ACCESS_KEY_COLUMN = 'Access key(s)';
const PROJECT_COLUMN = 'Project(s)';
const RIGHT_COLUMN = 'Right(s)';
const LIST_PROJECT_MSG = 'You have access to the following project(s)';
const LIST_ACCESS_KEY_MSG = 'You have the following access key(s)';


export const actionButton = css`
  cursor: pointer;
  float: right;
  display: inline-block;
  margin-left: 2em;
  &:hover,
  &:active,
  &:focus {
    color: inherit;
  }
`;

export const RequestButton = styled.label`
  border: 1px solid darkgreen;
  color: darkgreen;
  margin-bottom: 1em;
  &:hover,
  &:active,
  &:focus {
    color: #2e842e;
    border-color: #2e842e;

  }
  ${button};
`;
export const DeleteButton = styled.a`
  ${actionButton};
  color: ${props => props.theme.color_primary};
`;

export const Bullet = styled.ul`
  display: block;
  width: 500;
`;

export const Header = styled.li`
  display: block;
  border-bottom: 1px solid #8f8f8f;
  float: left;
  padding-left: 0.5em;
  font-weight: bold;
`;

export const AccessKeyHeader = styled(Header)`
  width: 100%;
`;

export const ProjectHeader = styled(Header)`
  width: 30%;
`;

export const RightHeader = styled(Header)`
  width: 70%;
`;

export const KeyPairTable = styled.ul`
  overflow: hidden;
`;

export const AccessTable = styled.div`
  overflow: hidden;
`;

export const Cell = styled.li`
  display: block;
  float: left;
  padding-left: 0.5em;
`;

export const ProjectCell = styled(Link)`
  display: block;
  float: left;
  width: 30%;
  padding-left: 0.5em;
`;

export const RightCell = styled(Cell)`
  width: 70%;
`;

export const AccessKeyCell = styled(Cell)`
  width: 70%;
`;

export const ActionCell = styled(Cell)`
  width: 30%;
`;

const KeyPairsEntity = ({ keypairsApi, value, onUpdatePopup, onRequestDeleteKey }) => {
  const onDelete = () => {
    onRequestDeleteKey(value.access_key, keypairsApi);
    onUpdatePopup({ key_delete_popup: true, keypairsApi });
  };
  return (
    <li>
      <Bullet>
        <AccessKeyCell>{value.access_key}</AccessKeyCell>
        <ActionCell>
          <DeleteButton onClick={onDelete}>
            {DELETE_BTN}
          </DeleteButton>
        </ActionCell>
      </Bullet>
    </li>
  );
};

const KeyPairsEntities = ({ values, keypairsApi, onUpdatePopup, onRequestDeleteKey }) => (
  <ul>
    {values.length > 0 && <li>
      <AccessKeyHeader>{ACCESS_KEY_COLUMN}</AccessKeyHeader>
    </li>}
    {values.map(item =>
      (<KeyPairsEntity
        key={item.access_key}
        keypairsApi={keypairsApi}
        value={item}
        onUpdatePopup={onUpdatePopup}
        onRequestDeleteKey={onRequestDeleteKey}
      />))}
  </ul>
);

const UserProfile = ({ user, userProfile, popups, submission, onCreateKey,
  onClearCreationSession, onUpdatePopup, onDeleteKey,
  onRequestDeleteKey, onClearDeleteSession }) => {
  const onCreate = () => {
    onCreateKey(credentialCdisPath);
  };
  const accessible_projects = Object.keys(user.project_access);
  return (
    <div>
      {
        userProfile.access_key_pairs === undefined &&
        <div>
          {NO_ACCESS_MSG}
        </div>
      }
      {
        userProfile.access_key_pairs !== undefined && userProfile.access_key_pairs !== [] &&
        <KeyPairTable>
          {
            popups.key_delete_popup === true &&
            <Popup
              message={CONFIRM_DELETE_MSG}
              error={jsonToString(userProfile.delete_error)}
              onConfirm={() => onDeleteKey(userProfile.request_delete_key, popups.keypairsApi)}
              onCancel={() => {
                onClearDeleteSession();
                onUpdatePopup({ key_delete_popup: false });
              }}
            />
          }
          {
            popups.save_key_popup === true &&
            <SavePopup
              message={SECRET_KEY_MSG}
              error={jsonToString(userProfile.create_error)}
              display={userProfile.access_key_pair}
              savingStr={userProfile.str_access_key_pair}
              onClose={() => {
                onUpdatePopup({ save_key_popup: false });
                onClearCreationSession();
              }}
              filename={'accessKeys.txt'}
            />
          }
          <RequestButton onClick={onCreate}>
            {CREATE_ACCESS_KEY_BTN}
          </RequestButton>
          {
            userProfile.access_key_pairs.length === 0 &&
            <div>
              {NO_ACCESS_KEY}
            </div>
          }
          {
            userProfile.access_key_pairs.length > 0 &&
            <h5>
              {LIST_ACCESS_KEY_MSG}
            </h5>
          }
          {
            userProfile.access_key_pairs &&
            <KeyPairsEntities
              key="list_access_id"
              values={userProfile.access_key_pairs}
              keypairsApi={credentialCdisPath}
              onUpdatePopup={onUpdatePopup}
              onRequestDeleteKey={onRequestDeleteKey}
            />
          }
        </KeyPairTable>
      }
      <AccessTable>
        <ul>
          <h5>{LIST_PROJECT_MSG}</h5>
          <li>
            <Bullet>
              <ProjectHeader>{PROJECT_COLUMN}</ProjectHeader>
              <RightHeader>{RIGHT_COLUMN}</RightHeader>
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
      </AccessTable>
    </div>
  );
};


export default UserProfile;
