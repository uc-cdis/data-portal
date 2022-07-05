import PropTypes from 'prop-types';
import Button from '../../../gen3-ui-component/components/Button';
import './ActionLayer.css';

/**
 * A layer over the graph.
 * Put action buttons here.
 * @param {Object} props
 * @param {import('../../../redux/types').RootState['ddgraph']['isSearchMode']} [props.isSearchMode]
 * @param {() => void} [props.onClearSearchResult]
 */
function ActionLayer({ isSearchMode = false, onClearSearchResult }) {
  return (
    <div className='action-layer'>
      {isSearchMode && (
        <Button
          className='action-layer__clear-search'
          onClick={onClearSearchResult}
          label='Clear Search Result'
        />
      )}
    </div>
  );
}

ActionLayer.propTypes = {
  isSearchMode: PropTypes.bool,
  onClearSearchResult: PropTypes.func,
};

export default ActionLayer;
