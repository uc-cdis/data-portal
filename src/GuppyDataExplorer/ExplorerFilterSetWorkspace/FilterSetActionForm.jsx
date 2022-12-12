import PropTypes from 'prop-types';
import Button from '../../gen3-ui-component/components/Button';
import FilterSetCreateForm from '../ExplorerFilterSetForms/FilterSetCreateForm';
import FilterSetDeleteForm from '../ExplorerFilterSetForms/FilterSetDeleteForm';
import FilterSetOpenForm from '../ExplorerFilterSetForms/FilterSetOpenForm';
import FilterSetShareForm from '../ExplorerFilterSetForms/FilterSetShareForm';
import FilterSetUpdateForm from '../ExplorerFilterSetForms/FilterSetUpdateForm';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('../types').SavedExplorerFilterSet} SavedExplorerFilterSet */
/** @typedef {'CLEAR-ALL' | 'DELETE' | 'LOAD' | 'SAVE' | 'SHARE'} ActionFormType */

/**
 * @param {Object} prop
 * @param {SavedExplorerFilterSet['filter']} prop.currentFilter
 * @param {{ active: SavedExplorerFilterSet; all: SavedExplorerFilterSet[]; empty: SavedExplorerFilterSet }} prop.filterSets
 * @param {(token: string) => Promise<SavedExplorerFilterSet>} prop.fetchWithToken
 * @param {Object} prop.handlers
 * @param {() => void} prop.handlers.clearAll
 * @param {() => void} prop.handlers.close
 * @param {(deleted: SavedExplorerFilterSet) => void} prop.handlers.delete
 * @param {(loaded: SavedExplorerFilterSet, isshared?: boolean) => void} prop.handlers.load
 * @param {(saved: SavedExplorerFilterSet) => void} prop.handlers.save
 * @param {() => Promise} prop.handlers.share
 * @param {ActionFormType} prop.type
 */
function FilterSetActionForm({
  currentFilter,
  filterSets,
  fetchWithToken,
  handlers,
  type,
}) {
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
          fetchWithToken={fetchWithToken}
          onAction={handlers.load}
          onClose={handlers.close}
        />
      );
    case 'SAVE':
      return filterSets.active === undefined ? (
        <FilterSetCreateForm
          currentFilter={currentFilter}
          currentFilterSet={filterSets.empty}
          filterSets={filterSets.all}
          onAction={handlers.save}
          onClose={handlers.close}
          isFiltersChanged={false}
        />
      ) : (
        <FilterSetUpdateForm
          currentFilter={currentFilter}
          currentFilterSet={filterSets.active}
          filterSets={filterSets.all}
          onAction={handlers.save}
          onClose={handlers.close}
          isFiltersChanged={
            JSON.stringify(currentFilter) !==
            JSON.stringify(filterSets.active.filter)
          }
        />
      );
    case 'SHARE':
      return (
        <FilterSetShareForm
          onAction={handlers.share}
          onClose={handlers.close}
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
  currentFilter: PropTypes.object,
  filterSets: PropTypes.object,
  fetchWithToken: PropTypes.func,
  handlers: PropTypes.shape({
    clearAll: PropTypes.func,
    close: PropTypes.func,
    delete: PropTypes.func,
    load: PropTypes.func,
    save: PropTypes.func,
    share: PropTypes.func,
  }),
  type: PropTypes.oneOf(['CLEAR-ALL', 'DELETE', 'LOAD', 'SAVE', 'SHARE']),
};

export default FilterSetActionForm;
