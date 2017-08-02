import React from 'react';
import { json_to_string, get_submit_path } from '../utils'
import { updatePopup } from '../actions';
import { Popup, SavePopup } from '../Popup/component';
import { connect } from 'react-redux';
import { fetchStorageAccess, createKey, deleteKey,
  requestDeleteKey, clearDeleteSession, clearCreationSession } from './actions';
import { Box } from '../theme';
import { RequestButton, DeleteButton, ProjectBullet } from './style';
import { credential_cdis_path } from '../localconf'
import * as constants from "./constants";

const Entity = ({keypairs_api, value, onUpdatePopup, onRequestDeleteKey}) => {
  let onDelete = () => {
    onRequestDeleteKey(value.access_key, keypairs_api);
    onUpdatePopup({key_delete_popup: true, keypairs_api: keypairs_api});
  };
  return (
    <tr>
      <td width="40%">{value.access_key}</td>
      <td width="10%" style={{'textAlign':'left'}}>
        <DeleteButton onClick={onDelete}>
          {constants.DELETE_BTN}
        </DeleteButton>
      </td>
    </tr>
  )
};

const Entities = ({keypairs_api, values, onUpdatePopup, onRequestDeleteKey}) => {
  return (
    <table width="100%">
      <tbody>
        <tr>
          {values.length > 0 &&
            <th>{constants.ACCESS_KEY_COLUMN}</th>
          }
        </tr>
        {values.map( (item) => <Entity key={item.access_key} keypairs_api={keypairs_api}
                                       value={item} onUpdatePopup={onUpdatePopup}
                                       onRequestDeleteKey={onRequestDeleteKey}/> )}
      </tbody>
    </table>
  )
};

const IdentityComponent = ({user, cloud_access, popups, onCreateKey, onClearCreationSession, onUpdatePopup, onDeleteKey,
                             onRequestDeleteKey, onClearDeleteSession}) => {
  let onCreate = () => {
    onCreateKey(credential_cdis_path);
  };
  return  (
    <div>
      {
        !cloud_access.access_key_pairs === undefined &&
        <div>
          {constants.NO_ACCESS_MSG}
        </div>
      }
      {
        cloud_access.access_key_pairs !== undefined &&
        <div>
          {
            popups.key_delete_popup === true &&
            <Popup message={constants.CONFIRM_DELETE_MSG}
                   error={json_to_string(cloud_access.delete_error)}
                   onConfirm={()=>onDeleteKey(cloud_access.request_delete_key, popups.keypairs_api)}
                   onCancel={()=>{ onClearDeleteSession(); onUpdatePopup({key_delete_popup: false})}}/>
          }
          {
            popups.save_key_popup === true &&
            <SavePopup message={constants.SECRET_KEY_MSG}
                       error={json_to_string(cloud_access.create_error)}
                       display={cloud_access.access_key_pair}
                       savingStr={cloud_access.str_access_key_pair}
                       onClose={()=>{onUpdatePopup({save_key_popup: false}); onClearCreationSession()}}
                       filename={'accessKeys.txt'}
            />
          }
          <RequestButton onClick={onCreate}>{constants.CREATE_ACCESS_KEY_BTN}</RequestButton>
          {
            cloud_access.access_key_pairs &&
            <Entities key='list_access_id' keypairs_api={credential_cdis_path}
                      values={cloud_access.access_key_pairs}
                      onUpdatePopup={onUpdatePopup}
                      onRequestDeleteKey={onRequestDeleteKey}
            />
          }
        </div>
      }
      <ul>
        <h4>{constants.LIST_PROJECT_MSG}</h4>
        {Object.keys(user.project_access).filter(
          (project) => user.project_access[project].indexOf('read-storage') !== -1).map(
            (project, i) => <ProjectBullet key={i}>{project}</ProjectBullet>)}
      </ul>
    </div>
  )
};


const mapStateToProps = (state) => {
  return {
    'user': state.user,
    'cloud_access': state.cloud_access,
    'popups': state.popups
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateKey: (keypairs_api) => dispatch(createKey(keypairs_api)),
    onUpdatePopup: (state) => dispatch(updatePopup(state)),
    onDeleteKey: (access_key, keypairs_api) => dispatch(deleteKey(access_key, keypairs_api)),
    onRequestDeleteKey: (access_key, keypairs_api) => dispatch(fetchStorageAccess(keypairs_api)).then(
        () => dispatch(requestDeleteKey(access_key))
    ),
    onClearDeleteSession: () => dispatch(clearDeleteSession()),
    onClearCreationSession: () => dispatch(clearCreationSession())
  };
};

let CloudAccess = connect(mapStateToProps, mapDispatchToProps)(IdentityComponent);
export default CloudAccess;
