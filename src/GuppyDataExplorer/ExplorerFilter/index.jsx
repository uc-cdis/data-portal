import PropTypes from 'prop-types';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import './ExplorerFilter.css';

/** @typedef {import('../types').GuppyData} GuppyData */

/**
 * @typedef {Object} ExplorerFilterProps
 * @property {string} [className]
 * @property {GuppyData['initialTabsOptions']} [initialTabsOptions]
 * @property {GuppyData['filter']} filter
 * @property {GuppyData['onFilterChange']} onFilterChange
 * @property {GuppyData['onAnchorValueChange']} onAnchorValueChange
 * @property {GuppyData['tabsOptions']} tabsOptions
 */

/** @param {ExplorerFilterProps} props */
function ExplorerFilter({ className = '', ...filterProps }) {
  const { adminAppliedPreFilters, filterConfig, guppyConfig, tierAccessLimit } =
    useExplorerConfig().current;
  const {
    initialAppliedFilters,
    patientIds,
    clearFilters,
    handlePatientIdsChange,
  } = useExplorerState();
  const connectedFilterProps = {
    ...filterProps,
    adminAppliedPreFilters,
    filterConfig,
    guppyConfig,
    initialAppliedFilters,
    patientIds,
    tierAccessLimit,
    onPatientIdsChange: handlePatientIdsChange,
  };
  const hasAppliedFilters = Object.keys(filterProps.filter).length > 0;

  return (
    <div className={className}>
      <div className='explorer-filter__title-container'>
        <h4 className='explorer-filter__title'>Filters</h4>
        {hasAppliedFilters && (
          <button
            type='button'
            className='explorer-filter__clear-button'
            onClick={clearFilters}
          >
            Clear all
          </button>
        )}
      </div>
      <ConnectedFilter {...connectedFilterProps} />
    </div>
  );
}

ExplorerFilter.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.object.isRequired, // from GuppyWrapper
  initialTabsOptions: PropTypes.object, // from GuppyWrapper
  onAnchorValueChange: PropTypes.func.isRequired, // from GuppyWrapper
  onFilterChange: PropTypes.func.isRequired, // from GuppyWrapper
  tabsOptions: PropTypes.object.isRequired, // from GuppWrapper
};

export default ExplorerFilter;
