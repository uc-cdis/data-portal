import PropTypes from 'prop-types';
import Button from '../../gen3-ui-component/components/Button';
import FilterSetCreateForm from '../ExplorerFilterSetForms/FilterSetCreateForm';
import FilterSetDeleteForm from '../ExplorerFilterSetForms/FilterSetDeleteForm';
import FilterSetOpenForm from '../ExplorerFilterSetForms/FilterSetOpenForm';
import FilterSetUpdateForm from '../ExplorerFilterSetForms/FilterSetUpdateForm';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
import useFilterSetWorkspace from './useFilterSetWorkspace';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {'CLEAR-ALL' | 'DELETE' | 'LOAD' | 'SAVE'} ActionFormType */

/**
 * @param {Object} prop
 * @param {ActionFormType} prop.type
 * @param {Object} prop.handlers
 * @param {() => void} prop.handlers.clearAll
 * @param {() => void} prop.handlers.close
 * @param {(deleted: ExplorerFilterSet) => void} prop.handlers.delete
 * @param {(loaded: ExplorerFilterSet) => void} prop.handlers.load
 * @param {(saved: ExplorerFilterSet) => void} prop.handlers.save
 */
function FilterSetActionForm({ handlers, type }) {
  const filterSets = useExplorerFilterSets();
  const workspace = useFilterSetWorkspace();
  switch (type) {
    case 'CLEAR-ALL':
      return (
        <div className='explorer-filter-set-form'>
          <h4>
            Are you sure to clear Workspace?
            <br />
            All unsaved changes to Filter Sets will be lost.
          </h4>
          <div>
            <Button
              buttonType='default'
              label='Back to page'
              onClick={handlers.close}
            />
            <Button label='Clear Workspace' onClick={handlers.clearAll} />
          </div>
        </div>
      );
    case 'LOAD':
      return (
        <FilterSetOpenForm
          currentFilterSet={filterSets.active ?? filterSets.empty}
          filterSets={filterSets.all}
          onAction={handlers.load}
          onClose={handlers.close}
        />
      );
    case 'SAVE':
      return filterSets.active === undefined ? (
        <FilterSetCreateForm
          currentFilter={workspace.active.filterSet.filter}
          currentFilterSet={filterSets.empty}
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
    clearAll: PropTypes.func,
    close: PropTypes.func,
    delete: PropTypes.func,
    load: PropTypes.func,
    save: PropTypes.func,
  }),
  type: PropTypes.oneOf(['CLEAR-ALL', 'DELETE', 'LOAD', 'SAVE']),
};

export default FilterSetActionForm;
