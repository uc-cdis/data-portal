import React from 'react';
import { json_to_string, get_submit_path } from '../utils'
import { updatePopup } from '../actions';
import { Popup, SavePopup } from '../Popup/component';
import { connect } from 'react-redux';
import { fetchAccess, createKey, deleteKey,
  requestDeleteKey, clearDeleteSession, clearCreationSession } from './actions';
import { RequestButton, DeleteButton, Bullet, ProjectCell, RightCell, AccessKeyCell, ActionCell, Cell,
  AccessKeyHeader, ProjectHeader, RightHeader } from './style';
import { credential_cdis_path } from '../localconf'
import * as constants from "./constants";

const KeyPairsEntity = ({keypairs_api, value, onUpdatePopup, onRequestDeleteKey}) => {
  let onDelete = () => {
    onRequestDeleteKey(value.access_key, keypairs_api);
    onUpdatePopup({key_delete_popup: true, keypairs_api: keypairs_api});
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
  )
};

const KeyPairsEntities = ({values, keypairs_api, onUpdatePopup, onRequestDeleteKey}) => {
  return (
    <ul>
      {values.length > 0 && <li>
        <AccessKeyHeader>{constants.ACCESS_KEY_COLUMN}</AccessKeyHeader>
      </li>}
      {values.map((item) =>
        <KeyPairsEntity key={item.access_key} keypairs_api={keypairs_api}
                        value={item} onUpdatePopup={onUpdatePopup}
                        onRequestDeleteKey={onRequestDeleteKey}/> )}
    </ul>
  )
};

const IdentityComponent = ({user, cloud_access, popups, submission, onCreateKey,
                             onClearCreationSession, onUpdatePopup, onDeleteKey,
                             onRequestDeleteKey, onClearDeleteSession}) => {
  let onCreate = () => {
    onCreateKey(credential_cdis_path);
  };
  let accessible_projects = Object.keys(user.project_access).filter(
    (p) => p in submission.projects).filter(
    (project) => user.project_access[project].indexOf('read') !== -1);
  return  (
    <div>
      {
        cloud_access.access_key_pairs === undefined &&
        <div>
          {constants.NO_ACCESS_MSG}
        </div>
      }
      {
        cloud_access.access_key_pairs !== undefined && cloud_access.access_key_pairs !== [] &&
        <div>
          {
            popups.key_delete_popup === true &&
            <Popup message={constants.CONFIRM_DELETE_MSG}
                   error={json_to_string(cloud_access.delete_error)}
                   onConfirm={()=>onDeleteKey(cloud_access.request_delete_key,
                              popups.keypairs_api)}
                   onCancel={()=>{ onClearDeleteSession();
                                   onUpdatePopup({key_delete_popup: false})}}/>
          }
          {
            popups.save_key_popup === true &&
            <SavePopup message={constants.SECRET_KEY_MSG}
                       error={json_to_string(cloud_access.create_error)}
                       display={cloud_access.access_key_pair}
                       savingStr={cloud_access.str_access_key_pair}
                       onClose={()=>{ onUpdatePopup({save_key_popup: false});
                                      onClearCreationSession()}}
                       filename={'accessKeys.txt'}
            />
          }
          <RequestButton onClick={onCreate}>
            {constants.CREATE_ACCESS_KEY_BTN}
          </RequestButton>
          {
            cloud_access.access_key_pairs.length === 0 &&
            <div>
              {constants.NO_ACCESS_KEY}
            </div>
          }
          {
            cloud_access.access_key_pairs.length > 0 &&
            <h5>
              {constants.LIST_ACCESS_KEY_MSG}
            </h5>
          }
          {
            cloud_access.access_key_pairs &&
            <KeyPairsEntities key='list_access_id'
                              values={cloud_access.access_key_pairs}
                              keypairs_api={credential_cdis_path}
                              onUpdatePopup={onUpdatePopup}
                              onRequestDeleteKey={onRequestDeleteKey}
            />
          }
        </div>
      }
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
            <li key={4*i}>
              <Bullet key={4*i+1}>
                <ProjectCell key={4*i+2} to={'/'+submission.projects[p]}>
                  {submission.projects[p]}
                </ProjectCell>
                <RightCell key={4*i+3}>
                  {user.project_access[p].join(', ')}
                </RightCell>
              </Bullet>
            </li>
        )}
      </ul>
    </div>
  )
};


const mapStateToProps = (state) => {
  return {
    'user': state.user,
    'cloud_access': state.cloud_access,
    'popups': state.popups,
    'submission': state.submission
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateKey: (keypairs_api) => dispatch(createKey(keypairs_api)),
    onUpdatePopup: (state) => dispatch(updatePopup(state)),
    onDeleteKey: (access_key, keypairs_api) =>
      dispatch(deleteKey(access_key, keypairs_api)),
    onRequestDeleteKey: (access_key, keypairs_api) =>
      dispatch(fetchAccess(keypairs_api)).then(
        () => dispatch(requestDeleteKey(access_key))
    ),
    onClearDeleteSession: () => dispatch(clearDeleteSession()),
    onClearCreationSession: () => dispatch(clearCreationSession())
  };
};

let CloudAccess = connect(mapStateToProps, mapDispatchToProps)(IdentityComponent);
export default CloudAccess;
