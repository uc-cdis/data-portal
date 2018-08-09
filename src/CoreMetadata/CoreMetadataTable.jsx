import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Table from '../components/tables/base/Table';
import './CoreMetadataTable.less';

const TABLE_TITLE = 'More Data Info';

function firstCharToUppercase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function fieldInTable(fieldName) {
  // only add in the table fields that are not in the header
  const headerFields = ['file_name', 'type', 'description', 'data_format', 'file_size', 'object_id', 'updated_datetime'];
  const doNotDisplay = ['project_id'];
  return (headerFields.indexOf(fieldName) === -1
    && doNotDisplay.indexOf(fieldName) === -1);
}

class CoreMetadataTable extends Component {
  dataTransform = metadata => (metadata ?
    Object.keys(metadata)
      .sort() // alphabetical order
      .filter(key => fieldInTable(key))
      .map(key => [
        <div className='core-metadata-table__title-cell'>{firstCharToUppercase(key)}</div>,
        metadata[key],
      ])
    : []);

  render() {
    return (
      <div className='core-metadata-table'>
        <Table
          header={[TABLE_TITLE, '']}
          data={this.dataTransform(this.props.metadata)}
        />
      </div>
    );
  }
}

CoreMetadataTable.propTypes = {
  metadata: PropTypes.object,
};

CoreMetadataTable.defaultProps = {
  metadata: null,
};

export default CoreMetadataTable;
