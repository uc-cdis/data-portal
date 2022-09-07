import { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import { defaultFilterSet as survivalDefaultFilterSet } from '../ExplorerSurvivalAnalysis/ControlForm';
import ExplorerFilterDisplay from '../ExplorerFilterDisplay';
import './ExplorerFilterSetForms.css';

/** @typedef {import('../types').SavedExplorerFilterSet} SavedExplorerFilterSet */

/**
 * @param {Object} prop
 * @param {SavedExplorerFilterSet} prop.currentFilterSet
 * @param {SavedExplorerFilterSet['filter']} prop.currentFilter
 * @param {SavedExplorerFilterSet[]} prop.filterSets
 * @param {boolean} prop.isFiltersChanged
 * @param {(created: SavedExplorerFilterSet) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function FilterSetCreateForm({
  currentFilterSet,
  currentFilter,
  filterSets,
  isFiltersChanged,
  onAction,
  onClose,
}) {
  const [filterSet, setFilterSet] = useState(currentFilterSet);
  const [error, setError] = useState({ isError: false, message: '' });
  function validate() {
    if (filterSet.name === '')
      setError({ isError: true, message: 'Name is required!' });
    else if (filterSet.name === survivalDefaultFilterSet.name)
      setError({ isError: true, message: 'Name is reserved!' });
    else if (filterSets.filter((c) => c.name === filterSet.name).length > 0)
      setError({ isError: true, message: 'Name is already in use!' });
    else setError({ isError: false, message: '' });
  }
  return (
    <div className='explorer-filter-set-form'>
      <h4>Save as a new Filter Set</h4>
      {currentFilterSet.name !== '' && isFiltersChanged && (
        <p>
          <FontAwesomeIcon
            icon='triangle-exclamation'
            color='var(--pcdc-color__secondary)'
          />{' '}
          You have changed filters for this Filter Set.
        </p>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <SimpleInputField
          label='Name'
          input={
            <input
              id='create-filter-set-name'
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              placeholder='Enter the Filter Set name'
              value={filterSet.name}
              onBlur={validate}
              onChange={(e) => {
                e.persist();
                setFilterSet({ ...filterSet, name: e.target.value });
              }}
            />
          }
          error={error}
        />
        <SimpleInputField
          label='Description'
          input={
            <textarea
              id='create-filter-set-description'
              placeholder='Describe the Filter Set (optional)'
              value={filterSet.description}
              onChange={(e) => {
                e.persist();
                setFilterSet({ ...filterSet, description: e.target.value });
              }}
            />
          }
        />
        <ExplorerFilterDisplay filter={currentFilter} />
      </form>
      <div>
        <Button buttonType='default' label='Back to page' onClick={onClose} />
        <Button
          enabled={filterSet.name !== currentFilterSet.name && !error.isError}
          label='Save Filter Set'
          onClick={() => onAction({ ...filterSet, filter: currentFilter })}
        />
      </div>
    </div>
  );
}

FilterSetCreateForm.propTypes = {
  currentFilterSet: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filter: PropTypes.object,
    id: PropTypes.number,
  }),
  currentFilter: PropTypes.object,
  filterSets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filter: PropTypes.object,
      id: PropTypes.number,
    })
  ),
  isFiltersChanged: PropTypes.bool,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

export default FilterSetCreateForm;
