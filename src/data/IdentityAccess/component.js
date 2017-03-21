import React from 'react';
import Nav from '../nav.js'
import { json_to_string, get_submit_path } from '../utils'
import { updatePopup } from '../actions';
import {Popup, SavePopup} from '../Popup';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { fetchCloudAccess, createUser, createKey, deleteKey,
  requestDeleteKey, clearDeleteSession, clearCreationSession } from './action';
import { button, Box } from '../../theme'

const actionButton = css`
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
const DeleteButton = styled.a`
  ${actionButton};
  color: ${props => props.theme.color_primary};
`;

const Entity = ({value, onUpdatePopup, onRequestDeleteKey}) => {
  let onDelete = () => {
    onRequestDeleteKey(value.access_key_id);
    onUpdatePopup({key_delete_popup: true});
  };
  return (
    <tr>
      <td width="40%">{value.access_key_id}</td>
      <td width="40%">{value.create_date}</td>
      <td width="10%">{value.status}</td>
      <td width="10%" style={{'textAlign':'left'}}>
        <DeleteButton onClick={onDelete}>
          Delete
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
          <th>Access key id</th><th>Created date</th>
          <th>Status</th>
          <th></th>
        </tr>
        {values.map( (item) => <Entity key={item.access_key_id} value={item}
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
        !cloud_access.user &&
        <div>
          You currently have no AWS access.<br/>
          <RequestButton onClick={onCreateUser}>Create user access</RequestButton>
        </div>
      }
      {
        cloud_access.user &&
        <div>
          <h3>Access keys</h3>
          {
            popups.key_delete_popup === true &&
            <Popup message={'Are you sure you want to make this key inactive?'}
                   error={json_to_string(cloud_access.delete_error)}
                   onConfirm={()=>onDeleteKey(cloud_access.request_delete_key)}
                   onCancel={()=>{ onClearDeleteSession(); onUpdatePopup({key_delete_popup: false})}}/>
          }
          {
            popups.save_key_popup === true &&
            <SavePopup message={'This secret key is only displayed this time. Please save it!'}
                       error={json_to_string(cloud_access.create_error)}
                       display={cloud_access.access_key_pair}
                       savingStr={cloud_access.str_access_key_pair}
                       onClose={()=>{onUpdatePopup({save_key_popup: false}); onClearCreationSession()}}
                       filename={'accessKeys.txt'}
            />
          }
          <RequestButton onClick={onCreateKey}>Create access key</RequestButton>
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
      onDeleteKey: (access_key_id) => dispatch(deleteKey(access_key_id)),
      onRequestDeleteKey: (access_key_id) => dispatch(fetchCloudAccess()).then(
          () => dispatch(requestDeleteKey(access_key_id))
      ),
      onClearDeleteSession: () => dispatch(clearDeleteSession()),
      onClearCreationSession: () => dispatch(clearCreationSession())
    };
};

let CloudAccess = connect(mapStateToProps, mapDispatchToProps)(IdentityComponent);
export default CloudAccess;
