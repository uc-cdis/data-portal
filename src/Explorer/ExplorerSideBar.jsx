import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { StyledCheckBoxGroup } from '../components/CheckBox';
import { ExplorerSidebarStyle } from './style';

class ExplorerSidebar extends Component {
  static propTypes = {
    projects: PropTypes.object,
    dictionary: PropTypes.object,
    selectedFilters: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    projects: {},
    dictionary: {},
    selectedFilters: {},
    onChange: () => {},
  };

  aggregateProperties = (dictionary, category, property, initialSet) => {
    let aggregateSet = initialSet || new Set();
    if (dictionary === 'undefined') {
      return (aggregateSet);
    }
    aggregateSet = Object.keys(dictionary).reduce(
      (d, key) => {
        if (dictionary[key].hasOwnProperty('category')
          && dictionary[key].category === category
          && dictionary[key].properties[property].hasOwnProperty('enum')
        ) {
          for (const propertyOption of dictionary[key].properties[property].enum) {
            if (!d.has(propertyOption)) {
              d.add(propertyOption);
            }
          }
        }
        return d;
      }, initialSet || new Set(),
    );
    return (aggregateSet);
  };

  render() {
    const projects = Object.values(this.props.projects);
    const fileTypes = Array.from(this.aggregateProperties(this.props.dictionary, 'data_file', 'data_type').values()).sort();
    const fileFormats = Array.from(this.aggregateProperties(this.props.dictionary, 'data_file', 'data_format').values()).sort();


    // console.log(this.props.selected_filters);

    return (
      <ExplorerSidebarStyle>
        <StyledCheckBoxGroup
          listItems={projects}
          title="Projects"
          selected_items={this.props.selectedFilters.projects}
          group_name="projects"
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
        <StyledCheckBoxGroup
          listItems={fileFormats}
          selected_items={this.props.selectedFilters.file_formats}
          title="File Formats"
          group_name="file_formats"
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
        <StyledCheckBoxGroup
          listItems={fileTypes}
          selected_items={this.props.selectedFilters.file_types}
          title="File Types"
          group_name="file_types"
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
      </ExplorerSidebarStyle>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.submission.projects,
  dictionary: state.submission.dictionary,
  selectedFilters: state.explorer.selected_filters || {
    projects: [],
    file_types: [],
    file_formats: [],
  },
});

const mapDispatchToProps = dispatch => ({
  onChange: (state) => {
    dispatch({
      type: 'SELECTED_LIST_CHANGED',
      data: state,
    });
  },
});

const SideBar = connect(mapStateToProps, mapDispatchToProps)(ExplorerSidebar);
export default SideBar;
