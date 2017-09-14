import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {StyledCheckBoxGroup} from '../components/CheckBox';
import 'react-table/react-table.css';
import {Sidebar} from '../theme';
import Relay from 'react-relay/classic';
import { withAuthTimeout, withBoxAndNav} from '../utils';
import {getReduxStore} from '../reduxStore.js';
import ExplorerTable from "./ExplorerTable";

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
      <StyledCheckBoxGroup listItems={projects} title="Projects"
                     selected_items={this.props.selected_filters.projects}
                     group_name="projects"
                     onChange={(state) => this.props.onChange({...this.props.selected_filters, ...state})}/>
      <StyledCheckBoxGroup listItems={file_formats}
                     selected_items={this.props.selected_filters.file_formats}
                     title="File Formats"
                     group_name="file_formats" onChange={(state) => this.props.onChange({...this.props.selected_filters, ...state})} />
      <StyledCheckBoxGroup listItems={file_types}
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

const mapFile = (listFile) => {
  return listFile.map( function(file) {
    return { project_id: file.project_id, name: file.file_name,
      category: file.data_category, format: file.data_format,
      type: file.data_type, size: file.file_size };
  });
};

class ExplorerComponent extends Component {
  static propTypes = {
    submission: PropTypes.object,
    selected_filters: PropTypes.object,
    viewer: PropTypes.object
  };

  createList = () => {
    const viewer = this.props.viewer || {
      submitted_aligned_reads: [],
      submitted_unaligned_reads: [],
      submitted_somatic_mutation: [],
      mri_result: [],
      submitted_copy_number: []
    };

    const files1 = mapFile(viewer.submitted_aligned_reads);
    const files2 = mapFile(viewer.submitted_unaligned_reads);
    const files3 = mapFile(viewer.submitted_somatic_mutation);
    const files4 = mapFile(viewer.mri_result);
    const files5 = mapFile(viewer.submitted_copy_number);
    return [...files1, ...files2, ...files3, ...files4, ...files5 ];
  };

  updateFilesList = () => {
    let filesList = this.createList();
    getReduxStore().then(
      (store) => {
        const explorerState = store.getState().explorer || {};
        if ( ! explorerState.filesList  ) {
          store.dispatch( { type: 'RECEIVE_FILE_LIST', data: filesList } );
        }
      }
    );
  };


  render() {
    this.updateFilesList();
    return (
      <div>
        <SideBar/>
        <ExplorerTable />
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
              mri_result(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
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


const RelayExplorer = Relay.createContainer(
  withBoxAndNav(withAuthTimeout(RelayExplorerComponent)),
  {
    fragments: {
      viewer:() => Relay.QL`
          fragment on viewer {
              ${RelayExplorerComponent.getFragment( 'viewer' )}
          }
      `
    }
  }
);

export default RelayExplorer;
