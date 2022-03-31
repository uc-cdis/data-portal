import PropTypes from 'prop-types';
import { FilterDisplay } from '../ExplorerFilterDisplay';
import './FilterSetFilterDisplay.css';

/**
 * @param {Object} props
 * @param {import('../types').ExplorerFilters} props.filters
 * @param {string} [props.title]
 */
function FilterSetFilterDisplay({ filters, title = 'Filters' }) {
  return (
    <div className='filter-set-filter-display'>
      {Object.keys(filters).length > 0 ? (
        <>
          <header>{title}</header>
          <main>
            <FilterDisplay filter={filters} />
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
