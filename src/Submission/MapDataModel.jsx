import React from 'react';
import PropTypes from 'prop-types';
import BackLink from '../components/BackLink';
import './MapDataModel.less';

class MapDataModel extends React.Component {
  render() {
    console.log('props', this.props)
    return(
      <div className='map-data-model'>
        <BackLink url='/submission/files' label='Back to My Files' />
        <div className='h1-typo'>
          Mapping {this.props.filesToMap.length} files to Data Model
        </div>
        <div className='map-data-model__form'>
          <div className='map-data-model__header'>
            Assign Project and Node Type
          </div>
        </div>
      </div>
    )
  }
}

MapDataModel.propTypes = {
  filesToMap: PropTypes.array,
};

MapDataModel.defaultProps = {
  filesToMap: [],
};

export default MapDataModel;
