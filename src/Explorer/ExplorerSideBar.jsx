import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CheckBoxGroup } from '../components/CheckBoxGroup';
import './ExplorerSideBar.less';

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
        if (Object.prototype.hasOwnProperty.call(dictionary[key], 'category')
          && dictionary[key].category === category
          && Object.prototype.hasOwnProperty.call(dictionary[key].properties[property], 'enum')
        ) {
          dictionary[key].properties[property].enum.forEach((propertyOption) => {
            if (!d.has(propertyOption)) {
              d.add(propertyOption);
            }
          });
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

    return (
      <div className='explorer-side-bar'>
        <CheckBoxGroup
          listItems={projects}
          title='Projects'
          selectedItems={this.props.selectedFilters.projects}
          groupName='projects'
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
        <CheckBoxGroup
          listItems={fileFormats}
          selectedItems={this.props.selectedFilters.file_formats}
          title='File Formats'
          groupName='file_formats'
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
        <CheckBoxGroup
          listItems={fileTypes}
          selectedItems={this.props.selectedFilters.file_types}
          title='File Types'
          groupName='file_types'
          onChange={state => this.props.onChange({ ...this.props.selectedFilters, ...state })}
        />
      </div>
    );
  }
}

export default ExplorerSideBar;
