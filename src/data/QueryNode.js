import React from 'react';
import { Link } from 'react-router';
import { json_to_string, get_submit_path } from './utils'
import { updatePopup } from './actions';
import Popup from './Popup';
import Nav from './nav';
import styled, { css } from 'styled-components';
import { input, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { clearDeleteSession, fetchQueryNode, submitSearchForm, deleteNode, requestDeleteNode } from './QueryNodeActions';
import { cube } from '../theme';
import { Box } from '../theme';

const SearchButton = styled.input`
  transition: 0.25s;
  color: white;
  margin-bottom: 1em;
  background-color: ${props => props.theme.color_secondary}; 
  border: 1px solid ${props => props.theme.color_secondary};
  &:hover,
  &:active,
  &:focus {
    background-color: ${props => props.theme.color_secondary_fade};
    border: 1px solid ${props => props.theme.color_secondary_fade};

  }
  padding: 0em 0.5em;
`;

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

const DownloadButton = styled.a`
   ${actionButton};
`;

const DeleteButton = styled.a`
  ${actionButton};
  color: ${props => props.theme.color_primary};
`;

const Input = styled.input`
  transition: 0.25s;
  margin-right: 1em;
  padding: 0em 0.5em;
`;

const QueryForm = ({node_types, project, onSearchFormSubmit}) =>  {
  let nodes_for_query = node_types.filter((nt) => !['program', 'project'].includes(nt));
  let handleQuerySubmit = (event) => {
    event.preventDefault();
    let form = event.target;
    let data = {project: project}
    for (let i =0; i<form.length; i++){
      let input = form[i];
      data[input.name] = input.value;
    }
    onSearchFormSubmit(data);
  };
  return (
      <form onSubmit={handleQuerySubmit}>
        <Input list='node_types' placeholder='entity type' type='text' name='node_type' />
        <datalist id='node_types'>
          {nodes_for_query.map( (node_type) => {return <option key={node_type} value={node_type}/>})}
        </datalist>
        <Input placeholder='submitter_id' type='text' name="submitter_id"/>
        <SearchButton type='submit' onSubmit={handleQuerySubmit} value='search' />
      </form>
  )
};

const Entity = ({value, project, onUpdatePopup, onRequestDeleteNode}) => {
  let onDelete = () => {
    onRequestDeleteNode({project: project, id: value.id});
    onUpdatePopup({nodedelete_popup: true});
  };
  return (
    <li>
      <span>{value.submitter_id}</span> 
      <DownloadButton href={get_submit_path(project) + '/export?format=json&ids='+value.id}>Download</DownloadButton>
      <DeleteButton onClick={onDelete}>Delete</DeleteButton>
    </li>
  )
};

const Entities = ({value, project, onUpdatePopup, onRequestDeleteNode}) => {
  return (
    <ul>
      {value.map( ( value) => <Entity project={project} onRequestDeleteNode={onRequestDeleteNode} onUpdatePopup={onUpdatePopup} key={value.submitter_id} value={value} /> )}
    </ul>
  )
};

const QueryNodeComponent = ({params, submission, query_nodes, popups, onSearchFormSubmit, onUpdatePopup, onDeleteNode, onRequestDeleteNode, onClearDeleteSession}) => {
  let project = params.project;
  return  (
    <Box>
      <Nav />
      <h3>browse <Link to={'/' + project}>{project}</Link> </h3>
      { popups.nodedelete_popup ===true &&
          <Popup message={'Are you sure you want to delete this node?'}
                 error={json_to_string(query_nodes.delete_error)}
                 code={json_to_string(query_nodes.query_node)}
                 onConfirm={()=>onDeleteNode({project, id:query_nodes.request_delete_node})}
                 onCancel={()=>{ onClearDeleteSession(); onUpdatePopup({nodedelete_popup: false})}}/>
      }
      <QueryForm onSearchFormSubmit={onSearchFormSubmit}
                 project={project}
                 node_types={submission.node_types}/>
      {
        query_nodes.search_status==='succeed: 200' &&
        Object.entries(query_nodes.search_result['data']).map((value) => {
          return (<Entities project={project}
                            onRequestDeleteNode={onRequestDeleteNode}
                            onUpdatePopup={onUpdatePopup}
                            node_type={value[0]} key={value[0]} value={value[1]}/>)
        })
      }
    </Box>
  )
};


const mapStateToProps = (state, ownProps) => {
  return {
    'submission': state.submission,
    'query_nodes': state.query_nodes,
    'popups': state.popups,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchFormSubmit: (value) => dispatch(submitSearchForm(value)),
    onUpdatePopup: (state) => dispatch(updatePopup(state)),
    onClearDeleteSession: () => dispatch(clearDeleteSession()),
    onDeleteNode: ({id, project}) => dispatch(deleteNode({id, project})),
    onRequestDeleteNode: ({id, project}) => dispatch(fetchQueryNode({id, project})).then(()=>dispatch(requestDeleteNode({id}))),
  }
};
const QueryNode = connect(mapStateToProps, mapDispatchToProps)(QueryNodeComponent);
export default QueryNode;
