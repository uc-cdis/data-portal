import React from 'react';
import PropTypes from 'prop-types';
import './DataSelector.less';

class DataSelector extends React.Component {
  render() {
    const data = this.props.layers;
    const listItems = Object.keys(data)
      .map((k) => {
        const d = data[k];
        return (
          <div key={k}>
            <label>
              <input
                className='layers-panel__checkbox'
                type='checkbox'
                defaultChecked={d.visible === 'visible'}
                onChange={(event) => this.props.onDataSelectChange(event, k)}
              />
              {d.title}
            </label>
          </div>
        );
      });
    return (
      <div className='map-selector'>
        {
          listItems
        }
      </div>
    );
  }
}

DataSelector.propTypes = {
  layers: PropTypes.object.isRequired,
  onDataSelectChange: PropTypes.func.isRequired,
};

export default DataSelector;
