import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyledCheckBoxGroup } from '../components/CheckBox';
import { ExplorerSidebarStyle } from './style';

class ExplorerSideBar extends Component {
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
          selectedItems={this.props.selectedFilters.projects}
          group_name="projects"
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
        <StyledCheckBoxGroup
          listItems={fileFormats}
          selectedItems={this.props.selectedFilters.file_formats}
          title="File Formats"
          group_name="file_formats"
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
        <StyledCheckBoxGroup
          listItems={fileTypes}
          selectedItems={this.props.selectedFilters.file_types}
          title="File Types"
          group_name="file_types"
          lastChild
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
      </ExplorerSidebarStyle>
    );
  }
}

export default ExplorerSideBar;
