import PropTypes from 'prop-types';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import { updatePatientIds } from '../../redux/explorer/slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import './ExplorerFilter.css';

/** @typedef {import('../../redux/types').RootState} RootState */
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
  const dispatch = useAppDispatch();
  /** @param {RootState['explorer']['patientIds']} ids */
  function handlePatientIdsChange(ids) {
    dispatch(updatePatientIds(ids));
  }
  const {
    config: { adminAppliedPreFilters, filterConfig, guppyConfig },
    patientIds,
  } = useAppSelector((state) => state.explorer);

  const connectedFilterProps = {
    ...filterProps,
    adminAppliedPreFilters,
    filterConfig,
    guppyConfig,
    patientIds,
    onPatientIdsChange: handlePatientIdsChange,
  };
  const hasExplorerFilter =
    Object.keys(filterProps.filter.value ?? {}).length > 0;
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
            onClick={() => filterProps.onFilterChange(undefined)}
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
