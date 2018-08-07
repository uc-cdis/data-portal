import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import Table from '../components/tables/base/Table';

const TABLE_TITLE = 'More Data Info';

export const TitleCell = styled.div`
  font-weight: bold;
`;

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
  dataTransform = metadata => metadata ?
    Object.keys(metadata)
      .sort() // alphabetical order
      .filter(key => fieldInTable(key))
      .map(key => [
        <TitleCell>{firstCharToUppercase(key)}</TitleCell>,
        metadata[key],
      ])
    : [];

  render() {
    return (
      <Table
        header={[TABLE_TITLE, '']}
        data={this.dataTransform(this.props.metadata)}
        colStyles={[{ paddingLeft: '0px', textAlign: 'left', width: '15%' }, { textAlign: 'left' }]}
      />
    );
  }
}

CoreMetadataTable.propTypes = {
  metadata: PropTypes.object,
};

export default CoreMetadataTable;
