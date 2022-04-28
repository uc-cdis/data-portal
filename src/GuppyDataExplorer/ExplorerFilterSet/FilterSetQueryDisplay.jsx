import PropTypes from 'prop-types';
import QueryDisplay from '../../components/QueryDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import './FilterSetQueryDisplay.css';

/**
 * @param {Object} props
 * @param {import('../types').ExplorerFilter} props.filters
 * @param {string} [props.title]
 */
function FilterSetQueryDisplay({ filters, title = 'Filters' }) {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  return (
    <div className='filter-set-query-display'>
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

FilterSetQueryDisplay.propTypes = {
  filters: PropTypes.any,
  title: PropTypes.string,
};

export default FilterSetQueryDisplay;
