import PropTypes from 'prop-types';
import FilterDisplay from '../../components/FilterDisplay';
import { useAppSelector } from '../../redux/hooks';
import './ExplorerFilterDisplay.css';

/**
 * @param {Object} props
 * @param {import('../types').ExplorerFilterSet['filter']} props.filter
 * @param {string} [props.title]
 */
function ExplorerFilterDisplay({ filter, title = 'Filters' }) {
  const filterInfo = useAppSelector(
    (state) => state.explorer.config.filterConfig.info
  );
  return (
    <div className='explorer-filter-display'>
      {Object.keys(filter?.value ?? {}).length > 0 ? (
        <>
          <header>{title}</header>
          <main>
            <FilterDisplay filter={filter} filterInfo={filterInfo} />
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

ExplorerFilterDisplay.propTypes = {
  filter: PropTypes.any,
  title: PropTypes.string,
};

export default ExplorerFilterDisplay;
