import PropTypes from 'prop-types';
import Select from 'react-select';
import { overrideSelectTheme } from '../../utils';
import FilterSetCreateForm from '../ExplorerFilterSetForms/FilterSetCreateForm';
import FilterSetDeleteForm from '../ExplorerFilterSetForms/FilterSetDeleteForm';
import FilterSetOpenForm from '../ExplorerFilterSetForms/FilterSetOpenForm';
import FilterSetUpdateForm from '../ExplorerFilterSetForms/FilterSetUpdateForm';
import './ExplorerFilterSet.css';

/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').ExplorerFilterSetActionType} ExplorerFilterSetActionType */

/**
 * @param {Object} prop
 * @param {boolean} prop.isFilterSetEmpty
 * @param {boolean} prop.hasNoSavedFilterSets
 * @param {(option: { label: string; value: ExplorerFilterSetActionType }) => void} prop.onSelectAction
 */
export function FilterSetActionMenu({
  isFilterSetEmpty,
  hasNoSavedFilterSets,
  onSelectAction,
}) {
  /** @type {{ label: string; value: ExplorerFilterSetActionType; isDisabled?: boolean }[]} */
  const options = [
    { label: 'New', value: 'new', isDisabled: isFilterSetEmpty },
    { label: 'Open', value: 'open', isDisabled: hasNoSavedFilterSets },
    { label: 'Save', value: 'save' },
    { label: 'Save As', value: 'save as', isDisabled: isFilterSetEmpty },
    { label: 'Delete', value: 'delete', isDisabled: isFilterSetEmpty },
  ];
  return (
    <Select
      aria-label='Manage filter sets'
      className='explorer-filter-set__menu'
      isSearchable={false}
      value={{ label: 'Manage Filter Set', value: '' }}
      options={options}
      theme={overrideSelectTheme}
      onChange={onSelectAction}
    />
  );
}

FilterSetActionMenu.propTypes = {
  isFilterSetEmpty: PropTypes.bool,
  hasNoSavedFilterSets: PropTypes.bool,
  onSelectAction: PropTypes.func,
};

/**
 * @param {Object} prop
 * @param {ExplorerFilterSetActionType} prop.actionType
 * @param {ExplorerFilterSet} prop.currentFilterSet
 * @param {ExplorerFilter} prop.currentFilter
 * @param {ExplorerFilterSet[]} prop.filterSets
 * @param {object} prop.handlers
 * @param {(opened: ExplorerFilterSet) => void} prop.handlers.handleOpen
 * @param {(created: ExplorerFilterSet) => void} prop.handlers.handleCreate
 * @param {(updated: ExplorerFilterSet) => void} prop.handlers.handleUpdate
 * @param {(deleted: ExplorerFilterSet) => void} prop.handlers.handleDelete
 * @param {() => void} prop.handlers.handleClose
 * @param {boolean} prop.isFiltersChanged
 */
export function FilterSetActionForm({
  actionType,
  currentFilterSet,
  currentFilter,
  filterSets,
  handlers,
  isFiltersChanged,
}) {
  const { handleOpen, handleCreate, handleUpdate, handleDelete, handleClose } =
    handlers;

  switch (actionType) {
    case 'open':
      return (
        <FilterSetOpenForm
          currentFilterSet={currentFilterSet}
          filterSets={filterSets}
          onAction={handleOpen}
          onClose={handleClose}
        />
      );
    case 'save':
      return currentFilterSet.name === '' ? (
        <FilterSetCreateForm
          currentFilterSet={currentFilterSet}
          currentFilter={currentFilter}
          filterSets={filterSets}
          isFiltersChanged={isFiltersChanged}
          onAction={handleCreate}
          onClose={handleClose}
        />
      ) : (
        <FilterSetUpdateForm
          currentFilterSet={currentFilterSet}
          currentFilter={currentFilter}
          filterSets={filterSets}
          isFiltersChanged={isFiltersChanged}
          onAction={handleUpdate}
          onClose={handleClose}
        />
      );
    case 'save as':
      return (
        <FilterSetCreateForm
          currentFilterSet={currentFilterSet}
          currentFilter={currentFilter}
          filterSets={filterSets}
          isFiltersChanged={isFiltersChanged}
          onAction={handleCreate}
          onClose={handleClose}
        />
      );
    case 'delete':
      return (
        <FilterSetDeleteForm
          currentFilterSet={currentFilterSet}
          onAction={handleDelete}
          onClose={handleClose}
        />
      );
    default:
      return null;
  }
}

FilterSetActionForm.propTypes = {
  actionType: PropTypes.oneOf(['new', 'open', 'save', 'save as', 'delete']),
  currentFilterSet: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filter: PropTypes.object,
    id: PropTypes.number,
  }),
  currentFilter: PropTypes.object,
  filterSets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filter: PropTypes.object,
      id: PropTypes.number,
    })
  ),
  handlers: PropTypes.shape({
    handleOpen: PropTypes.func,
    handleCreate: PropTypes.func,
    handleUpdate: PropTypes.func,
    handleDelete: PropTypes.func,
    handleClose: PropTypes.func,
  }),
  isFiltersChanged: PropTypes.bool,
};
