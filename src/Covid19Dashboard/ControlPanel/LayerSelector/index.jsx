import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import './LayerSelector.less';

const { Panel } = Collapse;

class LayerSelector extends React.Component {
  render() {
    return (
      <div className='map_selection'>
        <Collapse
          accordion
          bordered={false}
          defaultActiveKey={['0']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        >
          {Object.keys(this.props.layers)
            .map((key, ind) => {
              const { title } = this.props.layers[key];
              const data = this.props.layers[key].layers;
              return (
                <Panel header={title} key={ind}>
                  {Object.keys(data)
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
                    })}
                </Panel>
              );
            })}
        </Collapse>
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
