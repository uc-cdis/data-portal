import PropTypes from 'prop-types';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import { useAppSelector } from '../../redux/hooks';
import { useExplorerState } from '../ExplorerStateContext';
import './ExplorerFilter.css';

/** @typedef {import('../types').GuppyData} GuppyData */

/**
 * @typedef {Object} ExplorerFilterProps
 * @property {string} [anchorValue]
 * @property {string} [className]
 * @property {GuppyData['initialTabsOptions']} [initialTabsOptions]
 * @property {GuppyData['filter']} filter
 * @property {GuppyData['onFilterChange']} onFilterChange
 * @property {GuppyData['onAnchorValueChange']} onAnchorValueChange
 * @property {GuppyData['tabsOptions']} tabsOptions
 */

/** @param {ExplorerFilterProps} props */
function ExplorerFilter({ className = '', ...filterProps }) {
  const { adminAppliedPreFilters, filterConfig, guppyConfig } = useAppSelector(
    (state) => state.explorer.config
  );
  const {
    explorerFilter,
    patientIds,
    handleFilterChange,
    handlePatientIdsChange,
  } = useExplorerState();
  const connectedFilterProps = {
    ...filterProps,
    adminAppliedPreFilters,
    filterConfig,
    guppyConfig,
    explorerFilter,
    patientIds,
    onPatientIdsChange: handlePatientIdsChange,
  };
  const hasExplorerFilter = Object.keys(filterProps.filter).length > 0;
  const filterCombineMode = filterProps.filter.__combineMode ?? 'AND';
  function updateFilterCombineMode(e) {
    filterProps.onFilterChange({
      ...filterProps.filter,
      __combineMode: e.target.value,
    });
  }

  return (
    <div className={className}>
      <div className='explorer-filter__title-container'>
        <h4 className='explorer-filter__title'>Filters</h4>
        {hasExplorerFilter && (
          <button
            type='button'
            className='explorer-filter__clear-button'
            onClick={() => handleFilterChange(undefined)}
          >
            Clear all
          </button>
        )}
      </div>
      <div className='explorer-filter__combine-mode'>
        Combine filters with
        {['AND', 'OR'].map((/** @type {'AND' | 'OR'} */ combineMode) => (
          <label
            key={combineMode}
            className={filterCombineMode === combineMode ? 'active' : undefined}
          >
            <input
              name='combineMode'
              value={combineMode}
              type='radio'
              onChange={updateFilterCombineMode}
              checked={filterCombineMode === combineMode}
            />
            {combineMode}
          </label>
        ))}
      </div>
      <ConnectedFilter {...connectedFilterProps} />
    </div>
  );
}

ExplorerFilter.propTypes = {
  anchorValue: PropTypes.string, // from GuppyWrapper
  className: PropTypes.string,
  filter: PropTypes.object.isRequired, // from GuppyWrapper
  initialTabsOptions: PropTypes.object, // from GuppyWrapper
  onAnchorValueChange: PropTypes.func.isRequired, // from GuppyWrapper
  onFilterChange: PropTypes.func.isRequired, // from GuppyWrapper
  tabsOptions: PropTypes.object.isRequired, // from GuppWrapper
};

export default ExplorerFilter;
