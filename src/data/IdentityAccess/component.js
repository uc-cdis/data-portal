import React from 'react';
import Nav from '../nav.js'
import { json_to_string, get_submit_path } from '../utils'
import { updatePopup } from '../actions';
import {Popup, SavePopup} from '../Popup';
import { connect } from 'react-redux';
import { fetchStorageAccess, createUser, createKey, deleteKey,
  requestDeleteKey, clearDeleteSession, clearCreationSession } from './actions';
import { Box } from '../../theme';
import { RequestButton, DeleteButton } from './style';
import * as constants from "./constants";

const Entity = ({value, onUpdatePopup, onRequestDeleteKey}) => {
  let onDelete = () => {
    onRequestDeleteKey(value.access_key_id);
    onUpdatePopup({key_delete_popup: true});
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

const Entities = ({values, onUpdatePopup, onRequestDeleteKey}) => {
  return (
    <table width="100%">
      <tbody>
        <tr>
          <th>{constants.ACCESS_KEY_ID_COLUMN}</th>
          <th></th>
        </tr>
        {values.map( (item) => <Entity key={item.access_key} value={item}
                                       onUpdatePopup={onUpdatePopup}
                                       onRequestDeleteKey={onRequestDeleteKey}/> )}
      </tbody>
    </table>
  )
};

const IdentityComponent = ({cloud_access, popups, onCreateUser, onCreateKey, onClearCreationSession, onUpdatePopup, onDeleteKey,
                             onRequestDeleteKey, onClearDeleteSession}) => {
  return  (
    <Box>
      <Nav />
      {
        !cloud_access.access_key_pairs === undefined &&
        <div>
          {constants.NO_ACCESS_MSG}
        </div>
      }
      {
        cloud_access.access_key_pairs !== undefined &&
        <div>
          <h3>{constants.ACCESS_KEY_LBL}</h3>
          {
            popups.key_delete_popup === true &&
            <Popup message={constants.CONFIRM_DELETE_MSG}
                   error={json_to_string(cloud_access.delete_error)}
                   onConfirm={()=>onDeleteKey(cloud_access.request_delete_key)}
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
          <RequestButton onClick={onCreateKey}>{constants.CREATE_ACCESS_KEY_BTN}</RequestButton>
          {
            cloud_access.access_key_pairs &&
            <Entities key='list_access_id' values={cloud_access.access_key_pairs}
                      onUpdatePopup={onUpdatePopup}
                      onRequestDeleteKey={onRequestDeleteKey}
            />
          }
        </div>
      }
    </Box>
  )
};


const mapStateToProps = (state) => {
  return {
    'cloud_access': state.cloud_access,
    'popups': state.popups
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateUser: (state) => dispatch(createUser()),
    onCreateKey: (state) => dispatch(createKey()),
    onUpdatePopup: (state) => dispatch(updatePopup(state)),
    onDeleteKey: (access_key) => dispatch(deleteKey(access_key)),
    onRequestDeleteKey: (access_key) => dispatch(fetchStorageAccess()).then(
        () => dispatch(requestDeleteKey(access_key))
    ),
    onClearDeleteSession: () => dispatch(clearDeleteSession()),
    onClearCreationSession: () => dispatch(clearCreationSession())
  };
};

let CloudAccess = connect(mapStateToProps, mapDispatchToProps)(IdentityComponent);
export default CloudAccess;
