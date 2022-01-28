import PropTypes from 'prop-types';
import Table from '../components/tables/base/Table';
import './CoreMetadataTable.css';

const TABLE_TITLE = 'More Data Info';

function firstCharToUppercase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function fieldInTable(fieldName) {
  // only add in the table fields that are not in the header
  const headerFields = [
    'file_name',
    'type',
    'description',
    'data_format',
    'file_size',
    'object_id',
    'updated_datetime',
  ];
  const doNotDisplay = ['project_id'];
  return (
    headerFields.indexOf(fieldName) === -1 &&
    doNotDisplay.indexOf(fieldName) === -1
  );
}

function dataTransform(metadata) {
  return Object.keys(metadata)
    .sort() // alphabetical order
    .filter((key) => fieldInTable(key))
    .filter((key) => metadata[key]) // do not display row if empty
    .map((key) => [
      <div className='core-metadata-table__title-cell'>
        {firstCharToUppercase(key)}
      </div>,
      metadata[key],
    ]);
}
function CoreMetadataTable({ metadata }) {
  const tableData = metadata ? dataTransform(metadata) : [];
  return tableData.length > 0 ? (
    <div className='core-metadata-table'>
      <Table header={[TABLE_TITLE, '']} data={tableData} />
    </div>
  ) : null;
}

CoreMetadataTable.propTypes = {
  metadata: PropTypes.object,
};

CoreMetadataTable.defaultProps = {
  metadata: null,
};

export default CoreMetadataTable;
