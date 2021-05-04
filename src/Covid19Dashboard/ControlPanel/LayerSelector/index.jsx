import React from 'react';
import PropTypes from 'prop-types';
import './LayerSelector.less';
import IllinoisMapChart from '../../IllinoisMapChart';

class LayerSelector extends React.Component {

  render() {
    const data = this.props.layers;
    const listItems = Object.keys(data)
      .map((k) => {
        const d = data[k];
        return (
          <div key={k}>
            <input
              id={k}
              className='layers-panel__checkbox'
              type="checkbox"
              defaultChecked={d.visible === 'visible' ? true : false}
              onChange={(event) => this.props.onLayerSelectChange(event, k)}
            />
            <label>{d.title}</label>
          </div>
        );
      });
    return (
      <div className='map-selector'>
        <h3>Overlays</h3>
        {
          listItems
        }
      </div>
    );
  }
}

LayerSelector.propTypes = {
  layers: PropTypes.object.isRequired,
  onLayerSelectChange: PropTypes.func.isRequired,
};

export default LayerSelector;
