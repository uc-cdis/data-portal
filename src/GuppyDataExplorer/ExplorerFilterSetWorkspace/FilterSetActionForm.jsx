import PropTypes from 'prop-types';
import { createEmptyFilterSet } from '../ExplorerFilterSet/utils';
import FilterSetCreateForm from '../ExplorerFilterSetForms/FilterSetCreateForm';
import FilterSetOpenForm from '../ExplorerFilterSetForms/FilterSetOpenForm';
import FilterSetUpdateForm from '../ExplorerFilterSetForms/FilterSetUpdateForm';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
import useFilterSetWorkspace from './useFilterSetWorkspace';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').FilterSetWorkspaceAction} FilterSetWorkspaceAction */

const emptyFilterSet = createEmptyFilterSet();

/**
 * @param {Object} prop
 * @param {FilterSetWorkspaceAction['type']} prop.actionType
 * @param {object} prop.handlers
 * @param {() => void} prop.handlers.close
 * @param {(loaded: ExplorerFilterSet) => void} prop.handlers.load
 * @param {(saved: ExplorerFilterSet) => void} prop.handlers.save
 */
function FilterSetActionForm({ actionType, handlers }) {
  const filterSets = useExplorerFilterSets();
  const workspace = useFilterSetWorkspace();
  switch (actionType) {
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
    default:
      return null;
  }
}

FilterSetActionForm.propTypes = {
  actionType: PropTypes.oneOf(['LOAD', 'SAVE']),
  handlers: PropTypes.shape({
    close: PropTypes.func,
    load: PropTypes.func,
    save: PropTypes.func,
  }),
};

export default FilterSetActionForm;
