import PropTypes from 'prop-types';

export const GuppyConfigType = PropTypes.shape({
  path: PropTypes.string.isRequired,
  dataType: PropTypes.string.isRequired,
  manifestMapping: PropTypes.shape({
    resourceIndexType: 'file',
    resourceIdField: 'file_id', // TODO: change to object_id
    referenceIdFieldInResourceIndex: 'subject_id',
    referenceIdFieldInDataIndex: 'subject_id', // TODO: change to node_id
  }),
});

export const FilterConfigType = PropTypes.shape({
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    filters: PropTypes.arrayOf(PropTypes.shape({
      field: PropTypes.string,
      label: PropTypes.string,
    })),
  })),
});

export const TableConfigType = PropTypes.arrayOf(PropTypes.shape({
  field: PropTypes.string,
  name: PropTypes.string,
}));

export const ButtonConfigType = PropTypes.shape({
  buttons: PropTypes.arrayOf(PropTypes.shape({
    enabled: PropTypes.bool,
    type: PropTypes.string,
    title: PropTypes.string,
    leftIcon: PropTypes.string,
    rightIcon: PropTypes.string,
    fileName: PropTypes.string,
    dropdownId: PropTypes.string,
    tooltipText: PropTypes.string,
  })),
  dropdowns: PropTypes.object,
});

export const ChartConfigType = PropTypes.object;
