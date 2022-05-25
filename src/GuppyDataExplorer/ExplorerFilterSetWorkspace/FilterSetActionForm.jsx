import PropTypes from 'prop-types';
import { createEmptyFilterSet } from '../ExplorerFilterSet/utils';
import FilterSetOpenForm from '../ExplorerFilterSetForms/FilterSetOpenForm';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').FilterSetWorkspaceAction} FilterSetWorkspaceAction */

const emptyFilterSet = createEmptyFilterSet();

/**
 * @param {Object} prop
 * @param {FilterSetWorkspaceAction['type']} prop.actionType
 * @param {object} prop.handlers
 * @param {() => void} prop.handlers.close
 * @param {(loaded: ExplorerFilterSet) => void} prop.handlers.load
 */
function FilterSetActionForm({ actionType, handlers }) {
  const filterSets = useExplorerFilterSets();
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
    default:
      return null;
  }
}

FilterSetActionForm.propTypes = {
  actionType: PropTypes.oneOf(['LOAD']),
  handlers: PropTypes.shape({
    close: PropTypes.func,
    load: PropTypes.func,
  }),
};

export default FilterSetActionForm;
