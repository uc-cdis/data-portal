import { useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import SimpleInputField from '../../components/SimpleInputField';
import FilterSetQueryDisplay from '../ExplorerFilterSet/FilterSetQueryDisplay';

/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */

/**
 * @typedef {Object} FilterSetCardProps
 * @property {{ fitted: number; total: number }} [count]
 * @property {ExplorerFilterSet} filterSet
 * @property {string} label
 * @property {React.MouseEventHandler<HTMLButtonElement>} onClose
 */

/** @param {FilterSetCardProps} props */
export default function FilterSetCard({ count, filterSet, label, onClose }) {
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
        {count === undefined ? (
          <em>N/A</em>
        ) : (
          <Tooltip
            arrowContent={<div className='rc-tooltip-arrow-inner' />}
            mouseLeaveDelay={0}
            overlay={`${count.fitted} of ${count.total} subjects for this Filter Set is used to calculate survival rates`}
            placement='top'
            trigger={['hover', 'focus']}
          >
            <button type='button'>
              <em>
                {count.fitted}/{count.total}
              </em>
            </button>
          </Tooltip>
        )}
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
          <FilterSetQueryDisplay filters={filterSet.filters} />
        </>
      ) : null}
    </div>
  );
}

FilterSetCard.propTypes = {
  count: PropTypes.exact({
    fitted: PropTypes.number,
    total: PropTypes.number,
  }),
  filterSet: PropTypes.object,
  label: PropTypes.string,
  onClose: PropTypes.func,
};
