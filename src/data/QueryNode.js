import React from 'react';
import { updatePopup } from './actions';
import Popup from './Popup';
import Nav from './nav';
import styled, { css } from 'styled-components';
import { input, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { submitSearchForm } from './QueryNodeActions';
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
  margin-left: 1em;
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
    console.log(event.target);
    let form = event.target;
    let data = {project: project}
    for (var input of form) {
      data[input.name] = input.value;
    }
    console.log(data);
    onSearchFormSubmit(data);
  }
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
}
const Entity = ({value, onUpdatePopup}) => {
  let onDelete = () => {
    onUpdatePopup({nodedelete_popup: true});
  }
  return (
    <li>
      <span>{value.submitter_id}</span> 
      <DownloadButton>Download</DownloadButton>
      <DeleteButton onClick={onDelete}>Delete</DeleteButton>
    </li>
  )
}
const Entities = ({value, onUpdatePopup}) => {
  return (
    <ul>
      {value.map( ( value) => <Entity onUpdatePopup={onUpdatePopup} key={value.submitter_id} value={value} /> )}
    </ul>
  )
}
const QueryNodeComponent = ({params, submission, popups, onSearchFormSubmit, onUpdatePopup}) => {
  let project = params.project;
  return  (
    <Box>
      <Nav />
      { popups.nodedelete_popup == true &&
          <Popup message='test' onCancel={()=>onUpdatePopup({nodedelete_popup: false})}/>
      }
      <QueryForm onSearchFormSubmit={onSearchFormSubmit} project={project} node_types={submission.node_types}/>
      { submission.search_status=='succeed: 200' &&
          Object.entries(submission.search_result['data']).map((value) => { console.log(value); return (<Entities onUpdatePopup={onUpdatePopup} node_type={value[0]} key={value[0]} value={value[1]}/>)}) 
      }
    </Box>
  )
}


const mapStateToProps = (state, ownProps) => {
  console.log(state.submission);
  return {
    'submission': state.submission,
    'popups': state.popups,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchFormSubmit: (value) => dispatch(submitSearchForm(value)),
    onUpdatePopup: (state) => dispatch(updatePopup(state))
  }
}
const QueryNode = connect(mapStateToProps, mapDispatchToProps)(QueryNodeComponent);
export default QueryNode;
