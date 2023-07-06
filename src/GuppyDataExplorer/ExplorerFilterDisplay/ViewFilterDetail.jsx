import ExplorerFilterDisplay from './index';
import PropTypes from 'prop-types';
import Button from '../../gen3-ui-component/components/Button';

function ViewFilterDetail({
    filterSet,
    onClose
  }) {
    return (
      <div className='explorer-filter-set-form'>
        <h4>{filterSet.name}</h4>
        <p>{filterSet.description}</p>
        <div>
          <ExplorerFilterDisplay filter={filterSet?.filter} />
        </div>
        <div>
            <Button buttonType='default' label='Back to page' onClick={onClose} />
        </div>
      </div>
    );
  }
  
  ViewFilterDetail.propTypes = {
    currentFilterSet: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filter: PropTypes.object,
      id: PropTypes.number,
    }),
    onClose: PropTypes.func.isRequired
  };
  
  export default ViewFilterDetail;
  