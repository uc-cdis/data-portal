import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './ActionLayer.css';

class ActionLayer extends React.Component {
  handleClearSearch = () => {
    this.props.onClearSearch();
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
  onClearSearch: PropTypes.func,
};

ActionLayer.defaultProps = {
  isSearchMode: false,
  onClearSearch: () => {},
};

export default ActionLayer;
