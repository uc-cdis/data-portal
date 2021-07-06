import React from 'react';
import PropTypes from 'prop-types';
import './LayerSelector.less';

class LayerSelector extends React.Component {
  render() {
    const data = this.props.layers;
    const listItems = Object.keys(data)
      .map((k) => {
        const d = data[k];
        return (
          <div key={k}>
            <label>
              <input
                className='layers-panel__radio'
                type='radio'
                checked={k === this.props.activeLayer}
                onChange={(event) => this.props.onLayerSelectChange(event, k)}
              />
              {d.title}
            </label>
          </div>
        );
      });
    return (
      <div className='map-selector'>
        <form>
          {
            listItems
          }
        </form>
      </div>
    );
  }
}

LayerSelector.propTypes = {
  layers: PropTypes.object.isRequired,
  onLayerSelectChange: PropTypes.func.isRequired,
  activeLayer: PropTypes.string.isRequired,
};

export default LayerSelector;
