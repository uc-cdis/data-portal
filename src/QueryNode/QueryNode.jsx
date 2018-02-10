import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Select from 'react-select';
import PropTypes from 'prop-types';

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
  static propTypes = {
    project: PropTypes.string.isRequired,
  };

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
    const queryParam = [];

    for (let i = 0; i < form.length; i += 1) {
      const input = form[i];
      if (input.name && input.value) {
        queryParam.push(`${input.name}=${input.value}`);
        data[input.name] = input.value;
      }
    }
    const url = `/${this.props.project}/search?${queryParam.join('&')}`;
    this.props.onSearchFormSubmit(data, url);
  }


  updateValue(newValue) {
    this.setState({
      selectValue: newValue,
    });
  }

  render() {
    const nodesForQuery = this.props.nodeTypes.filter(nt => !['program', 'project'].includes(nt));
    const options = nodesForQuery.map(nodeType => ({ value: nodeType, label: nodeType }));
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

QueryForm.propTypes = {
  project: PropTypes.string.isRequired,
  nodeTypes: PropTypes.array,
  onSearchFormSubmit: PropTypes.func,
};

QueryForm.defaultProps = {
  nodeTypes: [],
  onSearchFormSubmit: null,
};

const Entity = ({ value, project, onUpdatePopup, onStoreNodeInfo }) => {
  const onDelete = () => {
    onStoreNodeInfo({ project, id: value.id }).then(
      () => onUpdatePopup({ nodedelete_popup: true }),
    );
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

Entity.propTypes = {
  project: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onUpdatePopup: PropTypes.func,
  onStoreNodeInfo: PropTypes.func,
};

Entity.defaultProps = {
  nodeTypes: [],
  onUpdatePopup: null,
  onStoreNodeInfo: null,
  onSearchFormSubmit: null,
};

const Entities = ({ value, project, onUpdatePopup, onStoreNodeInfo }) => (
  <ul>
    {
      value.map(
        v => (<Entity
          project={project}
          onStoreNodeInfo={onStoreNodeInfo}
          onUpdatePopup={onUpdatePopup}
          key={v.submitter_id}
          value={v}
        />),
      )
    }
  </ul>
);

Entities.propTypes = {
  value: PropTypes.array.isRequired,
  project: PropTypes.string.isRequired,
  onUpdatePopup: PropTypes.func,
  onStoreNodeInfo: PropTypes.func,
};

Entities.defaultProps = {
  onUpdatePopup: null,
  onStoreNodeInfo: null,
};

/**
 * QueryNode shows the details of a particular node
 */
class QueryNode extends React.Component {
  /**
   * Internal helper to render the "view node" popup if necessary
   * based on the popups and queryNodes properties attached to this component.
   *
   * @param {popups, queryNodes, onUpdatePopup} props including
   * props.popups.view_popup and props.queryNodes state
   * passed into the component by Redux
   * @return { state, popupEl } where state (just used for testing)
   * is string one of [viewNode, noPopup], and
   *    popupEl is either null or a <Popup> properly configured to render
   */
  renderViewPopup(props) {
    const { queryNodes, popups, onUpdatePopup } = props;
    const popup = {
      state: 'noPopup',
      popupEl: null,
    };

    if (
      popups &&
      popups.view_popup &&
      queryNodes.query_node
    ) {
      // View node button clicked
      popup.state = 'viewNode';
      popup.popupEl = (<Popup
        message={queryNodes.query_node.submitter_id}
        code={jsonToString(queryNodes.query_node)}
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
   * based on the popups and queryNodes properties attached to this component.
   *
   * @param {params, popups,
   * queryNodes, onUpdatePopup, onDeleteNode,
   * onClearDeleteSession} props including
   *        params.project, props.popups and props.queryNodes
   *        state passed into the component by Redux
   * @return { state, popupEl } where state (just used for testing) is
   *    string one of [confirmDelete, waitForDelete, deleteFailed, noPopup], and
   *    popupEl is either null or a <Popup> properly configured to render
   */
  renderDeletePopup(props) {
    const { params, queryNodes, popups, onUpdatePopup, onDeleteNode, onClearDeleteSession } = props;
    const popup = {
      state: 'noPopup',
      popupEl: null,
    };

    if (popups && popups.nodedelete_popup === true) {
      // User clicked on node 'Delete' button
      popup.state = 'confirmDelete';
      popup.popupEl = (<Popup
        message={'Are you sure you want to delete this node?'}
        error={jsonToString(queryNodes.delete_error)}
        code={jsonToString(queryNodes.query_node)}
        onConfirm={
          () => {
            onDeleteNode({ project: params.project, id: queryNodes.stored_node_info });
            onUpdatePopup({ nodedelete_popup: 'Waiting for delete to finish ...' });
          }
        }
        onCancel={() => { onClearDeleteSession(); onUpdatePopup({ nodedelete_popup: false }); }}
      />);
    } else if (queryNodes && queryNodes.query_node && queryNodes.delete_error) {
      // Error deleting node
      popup.state = 'deleteFailed';
      popup.popupEl = (<Popup
        message={`Error deleting: ${queryNodes.query_node.submitter_id}`}
        error={jsonToString(queryNodes.delete_error)}
        code={jsonToString(queryNodes.query_node)}
        onClose={() => { onClearDeleteSession(); onUpdatePopup({ nodedelete_popup: false }); }}
      />);
    } else if (popups && typeof popups.nodedelete_popup === 'string' && queryNodes && queryNodes.query_node) {
      // Waiting for node delete to finish
      popup.state = 'waitForDelete';
      popup.popupEl = <Popup message={popups.nodedelete_popup} />;
    }
    return popup;
  }

  render() {
    const project = this.props.params.project;

    return (
      <div>
        <h3>browse <Link to={`/${project}`}>{project}</Link> </h3>
        {
          this.renderViewPopup({
            queryNodes: this.props.queryNodes,
            popups: this.props.popups,
            onUpdatePopup: this.props.onUpdatePopup,
          }).popupEl
        }
        {
          this.renderDeletePopup(
            {
              params: this.props.params,
              queryNodes: this.props.queryNodes,
              popups: this.props.popups,
              onUpdatePopup: this.props.onUpdatePopup,
              onDeleteNode: this.props.onDeleteNode,
              onClearDeleteSession: this.props.onClearDeleteSession,
            }).popupEl
        }
        <QueryForm
          onSearchFormSubmit={
            (data, url) => this.props.onSearchFormSubmit(
              data, url, this.props.history,
            )
          }
          project={project}
          nodeTypes={this.props.submission.nodeTypes}
        />
        { this.props.queryNodes.search_status === 'succeed: 200' &&
            Object.entries(this.props.queryNodes.search_result.data).map(
              value => (<Entities
                project={project}
                onStoreNodeInfo={this.props.onStoreNodeInfo}
                onUpdatePopup={this.props.onUpdatePopup}
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

QueryNode.propTypes = {
  submission: PropTypes.object,
  history: PropTypes.object,
  params: PropTypes.object,
  queryNodes: PropTypes.object,
  popups: PropTypes.object,
  onSearchFormSubmit: PropTypes.func.isRequired,
  onUpdatePopup: PropTypes.func.isRequired,
  onClearDeleteSession: PropTypes.func.isRequired,
  onDeleteNode: PropTypes.func.isRequired,
  onStoreNodeInfo: PropTypes.func.isRequired,
};

QueryNode.defaultProps = {
  history: null,
  submission: null,
  params: null,
  queryNodes: null,
  popups: null,
};


export default QueryNode;
