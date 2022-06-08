import PropTypes from 'prop-types';
import Button from '../../gen3-ui-component/components/Button';
import './ExplorerFilterSetForms.css';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */

/**
 * @param {Object} prop
 * @param {ExplorerFilterSet} prop.currentFilterSet
 * @param {(deleted: ExplorerFilterSet) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function FilterSetDeleteForm({ currentFilterSet, onAction, onClose }) {
  return (
    <div className='explorer-filter-set-form'>
      <h4>Are you sure to delete the current Filter Set?</h4>
      <p style={{ marginBottom: '2rem' }}>
        Once deleted, this Filter Set will no longer be available.
      </p>
      <div>
        <Button buttonType='default' label='Back to page' onClick={onClose} />
        <Button
          label='Delete Filter Set'
          onClick={() => onAction(currentFilterSet)}
        />
      </div>
    </div>
  );
}

FilterSetDeleteForm.propTypes = {
  currentFilterSet: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filter: PropTypes.object,
    id: PropTypes.number,
  }),
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

export default FilterSetDeleteForm;
