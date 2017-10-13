import React from 'react';
import { Link } from 'react-router';
import styled, { css } from 'styled-components';
import { reduxForm } from 'redux-form';
import Select from 'react-select';

import { jsonToString, getSubmitPath } from '../utils';
import Popup from '../Popup/Popup';


const SearchButton = styled.input`
  transition: 0.25s;
  color: white;
  margin-bottom: 1em;
  background-color: ${props => props.theme.color_secondary};
  border: 1px solid ${props => props.theme.color_secondary};
  line-height: 34px;
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
const ViewButton = styled.a`
  ${actionButton};
  color: #2B547E;
`;
const Input = styled.input`
  transition: 0.25s;
  border: 1px solid #c1c1c1;
  line-height: 34px;
  margin-right: 1em;
  padding: 0em 0.5em;
  border-radius: 5px;
`;

const Dropdown = styled(Select)`
  width: 40%;
  float: left;
  margin-right: 1em;
`;

class QueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: null,
    };
    this.updateValue = this.updateValue.bind(this);
    this.handleQuerySubmit = this.handleQuerySubmit.bind(this);
  }

  handleQuerySubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = { project: this.props.project };
    const query_param = [];

    for (let i = 0; i < form.length; i++) {
      const input = form[i];
      if (input.name && input.value) {
        query_param.push(`${input.name}=${input.value}`);
        data[input.name] = input.value;
      }
    }
    const url = `/${this.props.project}/search?${query_param.join('&')}`;
    this.props.onSearchFormSubmit(data, url);
  }


  updateValue(newValue) {
    this.setState({
      selectValue: newValue,
    });
  }

  render() {
    const nodes_for_query = this.props.nodeTypes.filter(nt => !['program', 'project'].includes(nt));
    const options = nodes_for_query.map(node_type => ({ value: node_type, label: node_type }));
    const state = this.state || {};
    return (
      <form onSubmit={this.handleQuerySubmit}>
        <Dropdown name="node_type" options={options} value={state.selectValue} onChange={this.updateValue} />
        <Input placeholder="submitter_id" type="text" name="submitter_id" />
        <SearchButton type="submit" onSubmit={this.handleQuerySubmit} value="search" />
      </form>
    );
  }
}

const Entity = ({ value, project, onUpdatePopup, onStoreNodeInfo }) => {
  const onDelete = () => {
    onStoreNodeInfo({ project, id: value.id }).then(() => onUpdatePopup({ nodedelete_popup: true }));
  };
  const onView = () => {
    onStoreNodeInfo({ project, id: value.id }).then(() => onUpdatePopup({ view_popup: true }));
  };
  return (
    <li>
      <span>{value.submitter_id}</span>
      <DownloadButton href={`${getSubmitPath(project)}/export?format=json&ids=${value.id}`}>Download</DownloadButton>
      <ViewButton onClick={onView}>View</ViewButton>
      <DeleteButton onClick={onDelete}>Delete</DeleteButton>
    </li>
  );
};

const Entities = ({ value, project, onUpdatePopup, onStoreNodeInfo }) => (
  <ul>
    {value.map(value => <Entity project={project} onStoreNodeInfo={onStoreNodeInfo} onUpdatePopup={onUpdatePopup} key={value.submitter_id} value={value} />)}
  </ul>
);


/**
 * QueryNode shows the details of a particular node
 */
class QueryNode extends React.Component {
  /** 
   * Internal helper to render the "view node" popup if necessary
   * based on the popups and query_nodes properties attached to this component.
   * 
   * @param {popups, query_nodes, onUpdatePopup} props including props.popups.view_popup and props.query_nodes state passed into the component by Redux
   * @return { state, popupEl } where state (just used for testing) is string one of [viewNode, noPopup], and 
   *    popupEl is either null or a <Popup> properly configured to render
   */
  renderViewPopup(props) {
    const { query_nodes, popups, onUpdatePopup, onDeleteNode, onClearDeleteSession } = props;
    const popup = {
      state: 'noPopup',
      popupEl: null,
    };

    if (
      popups.view_popup &&
      query_nodes.query_node
    ) {
      // View node button clicked
      popup.state = 'viewNode';
      popup.popupEl = (<Popup
        message={query_nodes.query_node.submitter_id}
        code={jsonToString(query_nodes.query_node)}
        onClose={
          () => {
            onUpdatePopup({ view_popup: false });
          }
        }
      />);
    }
    return popup;
  }

  /** 
   * Internal helper to render the "delete node" popup if necessary
   * based on the popups and query_nodes properties attached to this component.
   * 
   * @param {params, popups, query_nodes, onUpdatePopup, onDeleteNode, onClearDeleteSession} props including params.project, props.popups and props.query_nodes state passed into the component by Redux
   * @return { state, popupEl } where state (just used for testing) is string one of [confirmDelete, waitForDelete, deleteFailed, noPopup], and 
   *    popupEl is either null or a <Popup> properly configured to render
   */
  renderDeletePopup(props) {
    const { params, query_nodes, popups, onUpdatePopup, onDeleteNode, onClearDeleteSession } = props;
    const popup = {
      state: 'noPopup',
      popupEl: null,
    };

    if (popups.nodedelete_popup === true) {
      // User clicked on node 'Delete' button
      popup.state = 'confirmDelete';
      popup.popupEl = (<Popup
        message={'Are you sure you want to delete this node?'}
        error={jsonToString(query_nodes.delete_error)}
        code={jsonToString(query_nodes.query_node)}
        onConfirm={
          () => {
            onDeleteNode({ project: params.project, id: query_nodes.stored_node_info });
            onUpdatePopup({ nodedelete_popup: 'Waiting for delete to finish ...' });
          }
        }
        onCancel={() => { onClearDeleteSession(); onUpdatePopup({ nodedelete_popup: false }); }}
      />);
    } else if (query_nodes.query_node && query_nodes.delete_error) {
      // Error deleting node
      popup.state = 'deleteFailed';
      popup.popupEl = (<Popup
        message={`Error deleting: ${query_nodes.query_node.submitter_id}`}
        error={jsonToString(query_nodes.delete_error)}
        code={jsonToString(query_nodes.query_node)}
        onClose={() => { onClearDeleteSession(); onUpdatePopup({ nodedelete_popup: false }); }}
      />);
    } else if (typeof popups.nodedelete_popup === 'string' && query_nodes.query_node) {
      // Waiting for node delete to finish
      popup.state = 'waitForDelete';
      popup.popupEl = <Popup message={popups.nodedelete_popup} />;
    }
    return popup;
  }

  render() {
    const { params, ownProps, submission, query_nodes, popups, onSearchFormSubmit, onUpdatePopup,
      onDeleteNode, onStoreNodeInfo,
      onClearDeleteSession,
    } = this.props;
    const project = params.project;

    return (
      <div>
        <h3>browse <Link to={`/${project}`}>{project}</Link> </h3>
        {this.renderViewPopup(this.props).popupEl}
        {this.renderDeletePopup(this.props).popupEl}
        <QueryForm onSearchFormSubmit={onSearchFormSubmit} project={project} nodeTypes={submission.nodeTypes} />
        { query_nodes.search_status === 'succeed: 200' &&
            Object.entries(query_nodes.search_result.data).map(
              value => (<Entities
                project={project}
                onStoreNodeInfo={onStoreNodeInfo}
                onUpdatePopup={onUpdatePopup}
                node_type={value[0]}
                key={value[0]}
                value={value[1]}
              />
              ),
            )
        }
      </div>
    );
  }
}

export default QueryNode;
