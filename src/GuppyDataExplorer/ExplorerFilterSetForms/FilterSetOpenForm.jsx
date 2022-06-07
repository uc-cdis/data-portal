import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import { overrideSelectTheme } from '../../utils';
import ExplorerFilterDisplay from '../ExplorerFilterDisplay';
import './ExplorerFilterSetForms.css';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */

/**
 * @param {Object} prop
 * @param {ExplorerFilterSet} prop.currentFilterSet
 * @param {ExplorerFilterSet[]} prop.filterSets
 * @param {(opened: ExplorerFilterSet) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function FilterSetOpenForm({
  currentFilterSet,
  filterSets,
  onAction,
  onClose,
}) {
  const options = filterSets.map((filterSet) => ({
    label: filterSet.name,
    value: filterSet,
  }));
  const [selected, setSelected] = useState({
    label: currentFilterSet.name,
    value: currentFilterSet,
  });
  return (
    <div className='explorer-filter-set-form'>
      <h4>Select a saved Filter Set to open</h4>
      <form onSubmit={(e) => e.preventDefault()}>
        <SimpleInputField
          label='Name'
          input={
            <Select
              inputId='open-filter-set-name'
              options={options}
              value={selected}
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              isClearable={false}
              theme={overrideSelectTheme}
              onChange={(e) => setSelected(e)}
            />
          }
        />
        <SimpleInputField
          label='Description'
          input={
            <textarea
              id='open-filter-set-description'
              disabled
              placeholder='No description'
              value={selected.value.description}
            />
          }
        />
        <ExplorerFilterDisplay filter={selected.value.filter} />
      </form>
      <div>
        <Button buttonType='default' label='Back to page' onClick={onClose} />
        <Button
          label='Open Filter Set'
          enabled={selected.value.name !== ''}
          onClick={() => onAction(selected.value)}
        />
      </div>
    </div>
  );
}

FilterSetOpenForm.propTypes = {
  currentFilterSet: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filter: PropTypes.object,
    id: PropTypes.number,
  }),
  filterSets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filter: PropTypes.object,
      id: PropTypes.number,
    })
  ),
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

export default FilterSetOpenForm;
