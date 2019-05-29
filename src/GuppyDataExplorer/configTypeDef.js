import PropTypes from 'prop-types';

export const GuppyConfigType = PropTypes.shape({
  path: PropTypes.string.isRequired,
  dataType: PropTypes.string.isRequired,
  fieldMapping: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    name: PropTypes.string,
  })),
  manifestMapping: PropTypes.shape({
    resourceIndexType: PropTypes.string,
    resourceIdField: PropTypes.string,
    referenceIdFieldInResourceIndex: PropTypes.string,
    referenceIdFieldInDataIndex: PropTypes.string,
  }),
  accessibleFieldCheckList: PropTypes.arrayOf(PropTypes.string),
  accessibleValidationField: PropTypes.string,
});

export const FilterConfigType = PropTypes.shape({
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.string),
  })),
});

export const TableConfigType = PropTypes.shape({
  enabled: PropTypes.bool,
  fields: PropTypes.arrayOf(PropTypes.string),
});

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
