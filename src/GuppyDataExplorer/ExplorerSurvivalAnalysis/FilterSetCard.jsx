import { useState } from 'react';
import PropTypes from 'prop-types';
import SimpleInputField from '../../components/SimpleInputField';
import { stringifyFilters } from '../ExplorerFilterSet/utils';

/**
 * @typedef {Object} FilterSetCardProps
 * @property {ExplorerFilterSet} filterSet
 * @property {string} label
 * @property {React.MouseEventHandler<HTMLButtonElement>} onClose
 */

/** @param {FilterSetCardProps} props */
export default function FilterSetCard({ filterSet, label, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleCard = () => setIsExpanded((s) => !s);
  return (
    <div className='explorer-survival-analysis__filter-set-card'>
      <header>
        <button type='button' onClick={toggleCard}>
          <i
            className={`g3-icon g3-icon--sm g3-icon--chevron-${
              isExpanded ? 'down' : 'right'
            }`}
          />
          {label}
        </button>
        <button aria-label='Clear' type='button' onClick={onClose}>
          <i className='g3-icon g3-icon--sm g3-icon--cross' />
        </button>
      </header>
      {isExpanded ? (
        <>
          <SimpleInputField
            label='Description'
            input={
              <textarea
                disabled
                placeholder='No description'
                value={filterSet.description}
              />
            }
          />
          <SimpleInputField
            label='Filters'
            input={
              <textarea
                disabled
                placeholder='No filters'
                value={stringifyFilters(filterSet.filters)}
              />
            }
          />
        </>
      ) : null}
    </div>
  );
}

FilterSetCard.propTypes = {
  filterSet: PropTypes.object,
  label: PropTypes.string,
  onClose: PropTypes.func,
};
