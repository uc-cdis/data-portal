import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { StyledCheckBoxGroup } from '../components/CheckBox';
import { Sidebar } from '../theme';

class ExplorerSidebar extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    projects: PropTypes.object,
    dictionary: PropTypes.object,
    selected_filters: PropTypes.object,
    onChange: PropTypes.func,
    onClientChange: PropTypes.func,
  };

  aggregateProperties = (dictionary, category, property, initialSet) => {
    const aggregateSet = initialSet || new Set();
    if (dictionary === 'undefined') {
      return (aggregateSet);
    }
    for (const node in dictionary) {
      if (dictionary[node].hasOwnProperty('category') && dictionary[node].category === category) {
        if (dictionary[node].properties[property].hasOwnProperty('enum')) {
          for (const property_option of dictionary[node].properties[property].enum) {
            if (!aggregateSet.has(property_option)) {
              aggregateSet.add(property_option);
            }
          }
        }
      }
    }
    return (aggregateSet);
  };

  render() {
    const projects = Object.values(this.props.projects);
    const file_types = Array.from(this.aggregateProperties(this.props.dictionary, 'data_file', 'data_type').values()).sort();
    const file_formats = Array.from(this.aggregateProperties(this.props.dictionary, 'data_file', 'data_format').values()).sort();


    // console.log(this.props.selected_filters);

    return (
      <Sidebar>
        <StyledCheckBoxGroup
          listItems={projects} title="Projects"
          selected_items={this.props.selected_filters.projects}
          group_name="projects"
          onChange={state => this.props.onChange({ ...this.props.selected_filters, ...state })}
        />
        <StyledCheckBoxGroup
          listItems={file_formats}
          selected_items={this.props.selected_filters.file_formats}
          title="File Formats"
          group_name="file_formats" onChange={state => this.props.onClientChange({ ...this.props.selected_filters, ...state })}
        />
        <StyledCheckBoxGroup
          listItems={file_types}
          selected_items={this.props.selected_filters.file_types}
          title="File Types"
          group_name="file_types" onChange={state => this.props.onClientChange({ ...this.props.selected_filters, ...state })}
        />
      </Sidebar>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.submission.projects,
  dictionary: state.submission.dictionary,
  selected_filters: state.explorer.selected_filters || { projects: [], file_types: [], file_formats: [] },
});

const mapDispatchToProps = dispatch => ({
  onChange: (state) => {
    dispatch({
      type: 'SELECTED_LIST_CHANGED',
      data: state,
    });
  },
  onClientChange: (state) => {
    dispatch({
      type: 'FILTERING_LIST_CHANGED',
      data: state,
    });
  },

});

const SideBar = connect(mapStateToProps, mapDispatchToProps)(ExplorerSidebar);
export default SideBar;
