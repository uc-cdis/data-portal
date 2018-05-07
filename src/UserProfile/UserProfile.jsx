import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { jsonToString } from '../utils';
import Popup from '../Popup/Popup';
import SavePopup from '../Popup/SavePopup';
import { button } from '../theme';
import { credentialCdisPath } from '../localconf';

const NO_ACCESS_MSG = 'You have no access to storage service. Please contact an admin to get it!';
const NO_API_KEY = 'You don\'t have any API key. Please create one!';
const CONFIRM_DELETE_MSG = 'Are you sure you want to make this key inactive?';
const SECRET_KEY_MSG = 'This secret key is only displayed this time. Please save it!';
const DELETE_BTN = 'Delete';
const CREATE_API_KEY_BTN = 'Create API key';
const API_KEY_COLUMN = 'API key(s)';
const EXPIRES_COLUMN = 'Expires';
const PROJECT_COLUMN = 'Project(s)';
const RIGHT_COLUMN = 'Right(s)';
const LIST_PROJECT_MSG = 'You have access to the following project(s)';
const LIST_API_KEY_MSG = 'You have the following API key(s)';


export const actionButton = css`
  cursor: pointer;
  display: inline-block;
  margin-left: 2em;
  &:hover,
  &:active,
  &:focus {
    color: inherit;
  }
`;
//
// export const RequestButton = styled.a`
// `;

export const DeleteButton = styled.a`
  ${actionButton};
`;

export const Bullet = styled.ul`
  display: block;
  width: 500;
`;

export const Header = styled.li`
  display: inline-block;
  padding-left: 0.5em;
  font-weight: bold;
`;

export const APIKeyHeader = styled(Header)`
  width: 40%;
`;

export const ExpiresHeader = styled(Header)`
  width: 60%;
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
  display: inline-block;
  padding-left: 0.5em;
`;

export const ProjectCell = styled(Link)`
  display: inline-block;
  width: 30%;
  padding-left: 0.5em;
`;

export const ProjectCellNoAccess = styled.div`
  display: inline-block;
  width: 30%;
  padding-left: 0.5em;
`;

export const RightCell = styled(Cell)`
  width: 70%;
`;

export const APIKeyCell = styled(Cell)`
  width: 40%;
`;

export const ExpireCell = styled(Cell)`
  width: 30%;
`;

export const ActionCell = styled(Cell)`
  width: 30%;
`;

const TimestampToDateTime = (timestamp) => {
  const t = new Date(timestamp * 1000);
  return t.toLocaleString();
};

const KeyPairsEntity = ({ keypairsApi, value, onUpdatePopup, onRequestDeleteKey }) => {
  const onDelete = () => {
    onRequestDeleteKey(value.jti, value.exp, keypairsApi);
    onUpdatePopup({ deleteTokenPopup: true, keypairsApi });
  };
  return (
    <li>
      <Bullet>
        <APIKeyCell>{value.jti}</APIKeyCell>
        <ExpireCell>{TimestampToDateTime(value.exp)}</ExpireCell>
        <ActionCell>
          <DeleteButton onClick={onDelete}>
            {DELETE_BTN}
          </DeleteButton>
        </ActionCell>
      </Bullet>
    </li>
  );
};

const keyType = PropTypes.shape({
  jti: PropTypes.string.isRequired,
  exp: PropTypes.number.isRequired,
});

KeyPairsEntity.propTypes = {
  keypairsApi: PropTypes.string.isRequired,
  value: keyType.isRequired,
  onUpdatePopup: PropTypes.func.isRequired,
  onRequestDeleteKey: PropTypes.func.isRequired,
};

const KeyPairsEntities = ({ values, keypairsApi, onUpdatePopup, onRequestDeleteKey }) => (
  <ul>
    {values.length > 0 &&
      <div>
        <APIKeyHeader>{API_KEY_COLUMN}</APIKeyHeader>
        <ExpiresHeader>{EXPIRES_COLUMN}</ExpiresHeader>
      </div>
    }
    <pre>
      <code>
        {values.map(item =>
          (<KeyPairsEntity
            key={item.jti}
            keypairsApi={keypairsApi}
            value={item}
            onUpdatePopup={onUpdatePopup}
            onRequestDeleteKey={onRequestDeleteKey}
          />))}
      </code>
    </pre>
  </ul>
);

KeyPairsEntities.propTypes = {
  keypairsApi: PropTypes.string.isRequired,
  onUpdatePopup: PropTypes.func.isRequired,
  onRequestDeleteKey: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(keyType).isRequired,
};


const UserProfile = ({ user, userProfile, popups, submission, onCreateKey,
  onClearCreationSession, onUpdatePopup, onDeleteKey,
  onRequestDeleteKey, onClearDeleteSession }) => {
  const onCreate = () => {
    onCreateKey(credentialCdisPath);
  };
  const accessibleProjects = Object.keys(user.project_access);
  return (
    <div>
      {
        userProfile.jtis === undefined &&
        <div>
          {NO_ACCESS_MSG}
        </div>
      }
      {
        userProfile.jtis !== undefined && userProfile.jtis !== [] &&
        <KeyPairTable>
          {
            popups.deleteTokenPopup === true &&
            <Popup
              message={CONFIRM_DELETE_MSG}
              error={jsonToString(userProfile.delete_error)}
              onConfirm={() => onDeleteKey(userProfile.requestDeleteJTI,
                userProfile.requestDeleteExp,
                popups.keypairsApi)}
              onCancel={() => {
                onClearDeleteSession();
                onUpdatePopup({ deleteTokenPopup: false });
              }}
            />
          }
          {
            popups.saveTokenPopup === true &&
            <SavePopup
              message={SECRET_KEY_MSG}
              error={jsonToString(userProfile.create_error)}
              display={userProfile.refreshCred}
              savingStr={userProfile.strRefreshCred}
              onClose={() => {
                onUpdatePopup({ saveTokenPopup: false });
                onClearCreationSession();
              }}
              filename={'credentials.json'}
            />
          }
          <a>
            <button
              id="create_key_button"
              onClick={onCreate}
              className="button-primary-white"
            >
              {CREATE_API_KEY_BTN}
            </button>
          </a>
          {
            userProfile.jtis.length === 0 &&
            <div>
              {NO_API_KEY}
            </div>
          }
          {
            userProfile.jtis.length > 0 &&
            <h5>
              {LIST_API_KEY_MSG}
            </h5>
          }
          {
            userProfile.jtis &&
            <KeyPairsEntities
              key="list_access_id"
              values={userProfile.jtis}
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
          <pre>
            <code>
              {accessibleProjects.map(
                p =>
                  (<li key={p}>
                    <Bullet>
                      {
                        p in submission.projects &&
                        <ProjectCell to={`/${submission.projects[p]}`}>
                          {p}
                        </ProjectCell>
                      }
                      {
                        !(p in submission.projects) &&
                        <ProjectCellNoAccess>
                          {p}
                        </ProjectCellNoAccess>
                      }
                      <RightCell>
                        {user.project_access[p].join(', ')}
                      </RightCell>
                    </Bullet>
                  </li>),
              )}
            </code>
          </pre>
        </ul>
      </AccessTable>
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
