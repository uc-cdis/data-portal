import PropTypes from 'prop-types';
import QueryDisplay from '../../components/QueryDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import './FilterSetFilterDisplay.css';

/**
 * @param {Object} props
 * @param {import('../types').ExplorerFilters} props.filters
 * @param {string} [props.title]
 */
function FilterSetFilterDisplay({ filters, title = 'Filters' }) {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  return (
    <div className='filter-set-filter-display'>
      {Object.keys(filters).length > 0 ? (
        <>
          <header>{title}</header>
          <main>
            <QueryDisplay filter={filters} filterInfo={filterInfo} />
          </main>
        </>
      ) : (
        <header>
          <em>No Filters</em>
        </header>
      )}
    </div>
  );
}

FilterSetFilterDisplay.propTypes = {
  filters: PropTypes.any,
  title: PropTypes.string,
};

export default FilterSetFilterDisplay;
