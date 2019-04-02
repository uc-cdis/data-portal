import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { jsonToString, getSubmitPath } from '../utils';
import Popup from '../components/Popup';
import QueryForm from './QueryForm';
import './QueryNode.less';

const Entity = ({ value, project, onUpdatePopup, onStoreNodeInfo, tabindexStart }) => {
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
      <a role='button' tabIndex={tabindexStart} className='query-node__button query-node__button--download' href={`${getSubmitPath(project)}/export?format=json&ids=${value.id}`}>Download</a>
      <a role='button' tabIndex={tabindexStart + 1} className='query-node__button query-node__button--view' onClick={onView}>View</a>
      <a role='button' tabIndex={tabindexStart + 2} className='query-node__button query-node__button--delete' onClick={onDelete}>Delete</a>
    </li>
  );
};

Entity.propTypes = {
  project: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  tabindexStart: PropTypes.number.isRequired,
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
        (v, i) => (<Entity
          project={project}
          onStoreNodeInfo={onStoreNodeInfo}
          onUpdatePopup={onUpdatePopup}
          key={v.submitter_id}
          value={v}
          tabindexStart={i * 3}
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
   * Internal helper to render the 'view node" popup if necessary
   * based on the popups and queryNodes properties attached to this component.
   *
   * @param {popups, queryNodes, onUpdatePopup} props including
   * props.popups.view_popup and props.queryNodes state
   * passed into the component by Redux
   * @return { state, popupEl } where state (just used for testing)
   * is string one of [viewNode, noPopup], and
   *    popupEl is either null or a <Popup> properly configured to render
   */
  static renderViewPopup(props) {
    const { queryNodes, popups, onUpdatePopup } = props;
    const popup = {
      state: 'noPopup',
      popupEl: null,
    };

    const closeViewPopup = () => {
      onUpdatePopup({ view_popup: false });
    };

    if (
      popups &&
      popups.view_popup &&
      queryNodes.query_node
    ) {
      // View node button clicked
      popup.state = 'viewNode';
      popup.popupEl = (<Popup
        title={queryNodes.query_node.submitter_id}
        lines={[{ code: jsonToString(queryNodes.query_node) }]}
        onClose={closeViewPopup}
        rightButtons={[
          {
            caption: 'Close',
            fn: closeViewPopup,
          },
        ]}
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
  static renderDeletePopup(props) {
    const { params, queryNodes, popups, onUpdatePopup, onDeleteNode, onClearDeleteSession } = props;
    const popup = {
      state: 'noPopup',
      popupEl: null,
    };
    const closeDelete = () => {
      onClearDeleteSession();
      onUpdatePopup({ nodedelete_popup: false });
    };

    if (popups && popups.nodedelete_popup === true) {
      // User clicked on node 'Delete' button
      popup.state = 'confirmDelete';
      popup.popupEl = (<Popup
        title={queryNodes.query_node.submitter_id}
        message={'Are you sure you want to delete this node?'}
        error={jsonToString(queryNodes.delete_error)}
        lines={[{ code: jsonToString(queryNodes.query_node) }]}
        leftButtons={[
          {
            caption: 'Cancel',
            fn: closeDelete,
          },
        ]}
        rightButtons={[
          {
            caption: 'Confirm',
            fn: () => {
              onDeleteNode({ project: params.project, id: queryNodes.stored_node_info });
              onUpdatePopup({ nodedelete_popup: 'Waiting for delete to finish ...' });
            },
          },
        ]}
        onClose={closeDelete}
      />);
    } else if (queryNodes && queryNodes.query_node && queryNodes.delete_error) {
      // Error deleting node
      popup.state = 'deleteFailed';
      popup.popupEl = (<Popup
        title={queryNodes.query_node.submitter_id}
        message={`Error deleting: ${queryNodes.query_node.submitter_id}`}
        error={jsonToString(queryNodes.delete_error)}
        lines={[{ code: jsonToString(queryNodes.query_node) }]}
        onClose={closeDelete}
      />);
    } else if (popups && typeof popups.nodedelete_popup === 'string' && queryNodes && queryNodes.query_node) {
      // Waiting for node delete to finish
      popup.state = 'waitForDelete';
      popup.popupEl = (<Popup
        title={queryNodes.query_node.submitter_id}
        message={popups.nodedelete_popup}
        onClose={() => onUpdatePopup({ nodedelete_popup: false })}
      />);
    }
    return popup;
  }

  render() {
    const queryNodesList = this.props.queryNodes.search_status === 'succeed: 200' ?
      Object.entries(this.props.queryNodes.search_result.data)
      : [];
    const project = this.props.params.project;

    return (
      <div>
        <h3>browse <Link to={`/${project}`}>{project}</Link> </h3>
        {
          QueryNode.renderViewPopup({
            queryNodes: this.props.queryNodes,
            popups: this.props.popups,
            onUpdatePopup: this.props.onUpdatePopup,
          }).popupEl
        }
        {
          QueryNode.renderDeletePopup({
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
          queryNodeCount={queryNodesList.length}
        />
        <h4>most recent 20:</h4>
        { queryNodesList.map(
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
