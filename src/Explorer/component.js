import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {CheckBoxGroup} from '../components/CheckBox';
import styled from 'styled-components';
import 'react-table/react-table.css';
import {Sidebar} from '../theme';
import ReactTable from 'react-table';
import Relay from 'react-relay/classic';
import { withAuthTimeout, withBoxAndNav} from '../utils';
import {getReduxStore} from '../reduxStore.js';
import {explorer} from "./reducers";

class TableExplorer extends Component{
  static propTypes = {
    filesList: PropTypes.array
  };

  render(){
    return(
      <div>
        <div>
          <ReactTable
            data= {this.props.filesList}
            columns={[
              {
                Header: 'Project',
                accessor: 'project_id'
              },
              {
                Header: 'File Name',
                accessor: 'name'
              },
              {
                Header: 'File Format',
                accessor: 'format'
              },
              {
                Header: 'File Size',
                accessor: 'size'
              },
              {
                Header: 'Category',
                accessor: 'category'
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
          <br />
        </div>
      </div>
    );
  }
}

class ExplorerSidebar extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    projects: PropTypes.object,
    dictionary: PropTypes.object,
    selected_filters: PropTypes.object,
    onChange: PropTypes.func
  };

  aggregateProperties = (dictionary, category, property) =>{
    let aggregateSet = new Set();
    if(dictionary === 'undefined'){
      return(aggregateSet);
    }
    for(let node in dictionary){
      if(dictionary[node].hasOwnProperty('category') && dictionary[node]['category'] === category){
        if(dictionary[node]['properties'][property].hasOwnProperty('enum')){
          for(let property_option of dictionary[node]['properties'][property]['enum']){
            if(!aggregateSet.has(property_option)){
              aggregateSet.add(property_option);
            }
          }
        }
      }
    }
    return(aggregateSet);
  };

  render(){
    let projects = Object.values(this.props.projects);
    let file_types = Array.from(this.aggregateProperties(this.props.dictionary, 'data_file', 'data_type').values());
    let file_formats = Array.from(this.aggregateProperties(this.props.dictionary, 'data_file', 'data_format').values());
    console.log(this.props.selected_filters);
    return(
      <Sidebar>
      <CheckBoxGroup listItems={projects} title="Projects"
                     selected_items={this.props.selected_filters.projects}
                     group_name="projects"
                     onChange={(state) => this.props.onChange({...this.props.selected_filters, ...state})}/>
      <CheckBoxGroup listItems={file_formats}
                     selected_items={this.props.selected_filters.file_formats}
                     title="File Formats"
                     group_name="file_formats" onChange={(state) => this.props.onChange({...this.props.selected_filters, ...state})} />
      <CheckBoxGroup listItems={file_types}
                     selected_items={this.props.selected_filters.file_types}
                     title="File Types"
                     group_name="file_types" onChange={(state) => this.props.onChange({...this.props.selected_filters, ...state})} />
      </Sidebar>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    'projects': state.submission.projects,
    'dictionary': state.submission.dictionary,
    'selected_filters': state.explorer.selected_filters || {projects: [], file_types: [], file_formats: []}
  }
};

const mapDispatchToProps = (dispatch) =>{
  return{
    onChange: (state) =>
    {
      dispatch({
        type: 'SELECTED_LIST_CHANGED',
        data: state
      });
    }
  }
};

const SideBar = connect(mapStateToProps, mapDispatchToProps)(ExplorerSidebar);

class ExplorerComponent extends Component {
  constructor(props) {
    super(props);
    getReduxStore().then((store) => {store.subscribe(() =>
    {
      const explorerState = store.getState().explorer;
      if (! explorerState.selected_filters)
        return;
      if (explorerState.selected_filters.projects !== props.relay.variables.projects ||
        explorerState.selected_filters.file_types !== props.relay.variables.file_types ||
        explorerState.selected_filters.file_formats !== props.relay.variables.file_formats)
      {
        props.relay.setVariables({
          selected_projects: explorerState.selected_filters.projects,
          selected_file_types: explorerState.selected_filters.file_types,
          selected_file_formats: explorerState.selected_filters.file_formats
        });
      }
    })});
  }
  static propTypes = {
    submission: PropTypes.object,
    selected_filters: PropTypes.object,
    viewer: PropTypes.object
  };

  create_list = () => {
    const viewer = this.props.viewer || {
      submitted_aligned_reads: [],
      submitted_unaligned_reads: [],
      submitted_somatic_mutation: [],
      submitted_methylation: [],
      submitted_copy_number: []
    };

    const files1 = viewer.submitted_aligned_reads.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    const files2 = viewer.submitted_unaligned_reads.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    const files3 = viewer.submitted_somatic_mutation.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    const files4 = viewer.submitted_methylation.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    const files5 = viewer.submitted_copy_number.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    return [...files1, ...files2, ...files3, ...files4, ...files5 ];
  };


  render() {
    const fileList = this.create_list();
    return (
      <div>
        <SideBar/>
        <TableExplorer filesList={fileList}/>
      </div>
    );
  }
}

export const RelayExplorerComponent = Relay.createContainer(
  ExplorerComponent,
  {
    initialVariables: {
      selected_projects: [],
      selected_file_types: [],
      selected_file_formats: []
    },
    fragments: {
      viewer: () => Relay.QL`
          fragment on viewer {
              submitted_aligned_reads(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
              submitted_unaligned_reads(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
              submitted_somatic_mutation(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
              submitted_methylation(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
              submitted_copy_number(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
          }
      `
    },
  },
);


/**
 * Relay route supporting PTBRelayAdapter below -
 * sets up per-project graphql query
 */

// class ExplorerRoute extends Relay.Route {
//   static paramDefinitions = {
//     selected_projects: { required: true },
//     selected_file_types: { required: true }
//   };
//
//   static queries = {
//     viewer: () => Relay.QL`
//         query {
//             viewer
//         }
//     `
//   };
//
//   static routeName = "ExplorerRoute"
// }
//
// export const ExplorerQuery = (props) => <Relay.Renderer Container={RelayExplorerComponent}
//                                       queryConfig={new ExplorerRoute({ selected_file_types:[], selected_projects:[]})}
//                                       environment={Relay.Store}
//                                       render={({ done, error, props, retry, stale }) => {
//                                         if (error) {
//                                           return <tr><td><b>Error! {error}</b></td></tr>;
//                                         } else if (props && props.viewer) {
//                                           return <RelayExplorerComponent {...props} />;
//                                         } else {
//                                           return <tr><td><b>Loading - put a spinner here?</b></td></tr>;
//                                         }
//                                       }}
// />;


// const RelayExplorer = Relay.createContainer(
//   withBoxAndNav(withAuthTimeout(ExplorerQuery)),
//   {
//     fragments: {
//       viewer:(variables) => Relay.QL`
//           fragment on viewer {
//               ${RelayExplorerComponent.getFragment( 'viewer', {...variables} )}
//           }
//       `
//     }
//   }
// );
// export default RelayExplorer;

const RelayExplorer = Relay.createContainer(
  withBoxAndNav(withAuthTimeout(RelayExplorerComponent)),
  {
    fragments: {
      viewer:(variables) => Relay.QL`
          fragment on viewer {
              ${RelayExplorerComponent.getFragment( 'viewer', {...variables} )}
          }
      `
    }
  }
);

export default RelayExplorer;