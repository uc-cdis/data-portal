import PropTypes from 'prop-types';
import QueryDisplay from '../../components/QueryDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import './FilterSetQueryDisplay.css';

/**
 * @param {Object} props
 * @param {import('../types').ExplorerFilterSet['filter']} props.filter
 * @param {string} [props.title]
 */
function FilterSetQueryDisplay({ filter, title = 'Filters' }) {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  return (
    <div className='filter-set-query-display'>
      {Object.keys(filter ?? {}).length > 0 ? (
        <>
          <header>{title}</header>
          <main>
            <QueryDisplay filter={filter} filterInfo={filterInfo} />
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
  filter: PropTypes.any,
  title: PropTypes.string,
};

export default FilterSetQueryDisplay;
