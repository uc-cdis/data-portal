import PropTypes from 'prop-types';
import { createEmptyFilterSet } from '../ExplorerFilterSet/utils';
import FilterSetCreateForm from '../ExplorerFilterSetForms/FilterSetCreateForm';
import FilterSetDeleteForm from '../ExplorerFilterSetForms/FilterSetDeleteForm';
import FilterSetOpenForm from '../ExplorerFilterSetForms/FilterSetOpenForm';
import FilterSetUpdateForm from '../ExplorerFilterSetForms/FilterSetUpdateForm';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
import useFilterSetWorkspace from './useFilterSetWorkspace';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {'DELETE' | 'LOAD' | 'SAVE'} ActionFormType */

const emptyFilterSet = createEmptyFilterSet();

/**
 * @param {Object} prop
 * @param {ActionFormType} prop.type
 * @param {Object} prop.handlers
 * @param {() => void} prop.handlers.close
 * @param {(deleted: ExplorerFilterSet) => void} prop.handlers.delete
 * @param {(loaded: ExplorerFilterSet) => void} prop.handlers.load
 * @param {(saved: ExplorerFilterSet) => void} prop.handlers.save
 */
function FilterSetActionForm({ handlers, type }) {
  const filterSets = useExplorerFilterSets();
  const workspace = useFilterSetWorkspace();
  switch (type) {
    case 'LOAD':
      return (
        <FilterSetOpenForm
          currentFilterSet={filterSets.active ?? emptyFilterSet}
          filterSets={filterSets.all}
          onAction={handlers.load}
          onClose={handlers.close}
        />
      );
    case 'SAVE':
      return filterSets.active === undefined ? (
        <FilterSetCreateForm
          currentFilter={workspace.active.filterSet.filter}
          currentFilterSet={emptyFilterSet}
          filterSets={filterSets.all}
          onAction={handlers.save}
          onClose={handlers.close}
          isFiltersChanged={false}
        />
      ) : (
        <FilterSetUpdateForm
          currentFilter={workspace.active.filterSet.filter}
          currentFilterSet={filterSets.active}
          filterSets={filterSets.all}
          onAction={handlers.save}
          onClose={handlers.close}
          isFiltersChanged={false}
        />
      );
    case 'DELETE':
      return (
        <FilterSetDeleteForm
          currentFilterSet={filterSets.active}
          onAction={handlers.delete}
          onClose={handlers.close}
        />
      );
    default:
      return null;
  }
}

FilterSetActionForm.propTypes = {
  handlers: PropTypes.shape({
    close: PropTypes.func,
    delete: PropTypes.func,
    load: PropTypes.func,
    save: PropTypes.func,
  }),
  type: PropTypes.oneOf(['DELETE', 'LOAD', 'SAVE']),
};

export default FilterSetActionForm;
