import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import Table from './base/Table';

const TABLE_TITLE = 'More Data Info';

export const TitleCell = styled.div`
  font-weight: bold;
`;

function firstCharToUppercase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function isHeaderField(fieldName) {
    const headerFields = ['file_name', 'data_type', 'description', 'data_format', 'file_size', 'object_id', 'updated_datetime'];
    return (headerFields.indexOf(fieldName) >= 0);
}

class CoreMetadataTable extends Component {
  dataTransform = metadata => Object.keys(metadata)
  .sort() // alphabetical order
  .filter(function(key) {
    return !isHeaderField(key); // only add non-header fields to the table
  })
  .map(key => [
    <TitleCell>{firstCharToUppercase(key)}</TitleCell>,
    metadata[key],
  ]);

  render() {
    return (
      <Table
        header={[TABLE_TITLE, '']}
        data={this.dataTransform(this.props.metadata)}
        colStyles={[{ textAlign: 'left', width: '15%' }, { textAlign: 'left' },]}
      />
    );
  }
}

CoreMetadataTable.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default CoreMetadataTable;
