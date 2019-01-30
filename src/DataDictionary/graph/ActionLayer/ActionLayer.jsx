import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './ActionLayer.css';

/**
* A layer over the graph.
* Put action buttons here.
*/
class ActionLayer extends React.Component {
  handleClearSearch = () => {
    this.props.onClearSearchResult();
  }

  render() {
    return (
      <div className='action-layer'>
        {
          this.props.isSearchMode && (
            <Button
              className='action-layer__clear-search'
              onClick={this.handleClearSearch}
              label='Clear Search Result'
            />
          )
        }
      </div>
    );
  }
}

ActionLayer.propTypes = {
  isSearchMode: PropTypes.bool,
  onClearSearchResult: PropTypes.func,
};

ActionLayer.defaultProps = {
  isSearchMode: false,
  onClearSearchResult: () => {},
};

export default ActionLayer;
