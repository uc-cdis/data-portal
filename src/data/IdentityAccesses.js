import React from 'react';
import { Box } from '../theme';
import Nav from './nav.js'
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { fetchCloudAccess, deleteNode, requestDeleteNode } from './AccessActions';

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

const InactivateButton = styled.a`
  ${actionButton};
  color: ${props => props.theme.color_primary};
`;

const Entity = ({value}) => {
  let onDelete = () => {
    onRequestDeleteNode({project: project, id: value.id});
    onUpdatePopup({nodedelete_popup: true});
  };
  return (
    <tr>
      <td width="40%">{value.access_key_id}</td>
      <td width="40%">{value.create_date}</td>
      <td width="10%" style={{'textAlign':'right'}}>{value.status}</td>
      <td width="10%" style={{'textAlign':'left'}}>
        <InactivateButton onClick={onDelete}>
          Inactivate
        </InactivateButton>
      </td>
    </tr>
  )
};

const Entities = ({values}) => {
  return (
    <table width="100%">
      <tbody>
        <tr>
          <th>Access key id</th><th>Created date</th>
          <th colSpan="2" style={{'textAlign': 'center'}}>Status</th>
        </tr>
        {values.map( (item) => <Entity key={item.access_key_id} value={item} /> )}
      </tbody>
    </table>
  )
};

const IdentityComponent = ({cloud_access}) => {
  return  (
    <Box>
      <Nav />
      <h3>Access keys</h3>
        <Entities key='list_access_id' values={cloud_access.access_key_pairs}/>
    </Box>
  )
};


const mapStateToProps = (state) => {
    return {
        'cloud_access': state.cloud_access
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
      onUpdatePopup: (state) => dispatch(updatePopup(state)),
      onDeleteNode: (access_key_id) => dispatch(deleteNode({id, project})),
      onRequestDeleteNode: (access_key_id)
        => dispatch(fetchCloudAccess()).then(
          () => dispatch(requestDeleteKey({access_key_id}))
      ),
    };
};


let CloudAccess = connect(mapStateToProps, mapDispatchToProps)(IdentityComponent);
export default CloudAccess;
