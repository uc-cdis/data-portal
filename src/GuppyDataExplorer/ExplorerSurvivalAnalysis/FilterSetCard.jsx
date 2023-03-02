import { useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleInputField from '../../components/SimpleInputField';
import ExplorerFilterDisplay from '../ExplorerFilterDisplay';

/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */

/**
 * @typedef {Object} FilterSetCardProps
 * @property {{ fitted: number; total: number }} [count]
 * @property {ExplorerFilterSet & { isStale: boolean } & {hasOptedOutConsortiums: boolean}} filterSet
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
        {filterSet.isStale && (
          <button type='button'>
            <Tooltip
              arrowContent={<div className='rc-tooltip-arrow-inner' />}
              mouseLeaveDelay={0}
              overlay={
                'This Filter Set has been updated and its survival analysis result may be stale. Click "Apply" button at the bottom to update the result.'
              }
              placement='top'
              trigger={['hover', 'focus']}
            >
              <FontAwesomeIcon
                icon='triangle-exclamation'
                color='var(--pcdc-color__secondary)'
              />
            </Tooltip>
          </button>
        )}
        {filterSet.hasOptedOutConsortiums && (
          <button type='button'>
            <Tooltip
              arrowContent={<div className='rc-tooltip-arrow-inner' />}
              mouseLeaveDelay={0}
              overlay={
                'Not all patients in the filter set are represented due to one or more consortiums opting out of participation in the pilot'
              }
              placement='top'
              trigger={['hover', 'focus']}
            >
              <FontAwesomeIcon
                icon='triangle-exclamation'
                color='var(--pcdc-color__secondary)'
              />
            </Tooltip>
          </button>
        )}
        {count === undefined ? (
          <em>N/A</em>
        ) : (
          <button type='button'>
            <Tooltip
              arrowContent={<div className='rc-tooltip-arrow-inner' />}
              mouseLeaveDelay={0}
              overlay={`${count.fitted} of ${count.total} subjects for this Filter Set is used to calculate survival rates.`}
              placement='top'
              trigger={['hover', 'focus']}
            >
              <em>
                {count.fitted}/{count.total}
              </em>
            </Tooltip>
          </button>
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
          <ExplorerFilterDisplay filter={filterSet.filter} />
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
