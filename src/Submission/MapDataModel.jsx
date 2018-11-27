import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import BackLink from '../components/BackLink';
import './MapDataModel.less';

class MapDataModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      nodeType: null,
    }
  }

  selectProjectId = option => {
    this.setState({ projectId: option ? option.value : null });
  }

  selectNodeType = option => {
    this.setState({ nodeType: option ? option.value : null });
  }

  render() {
    return(
      <div className='map-data-model'>
        <BackLink url='/submission/files' label='Back to My Files' />
        <div className='h1-typo'>
          Mapping {this.props.filesToMap.length} files to Data Model
        </div>
        <div className='map-data-model__form'>
          <div className='map-data-model__header'>
            <div className='h3-typo'>Assign Project and Node Type</div>
            <div className='h3-typo'>Step 1 of 2</div>
          </div>
          <div className='map-data-model__form-section'>
            <div className='h4-typo'>Project</div>
              <Select
                className='map-data-model__dropdown .map-data-model__dropdown--required introduction'
                value={this.state.projectId}
                placeholder={'Select your project'}
                options={[
                  {value: 'proj1', label: 'Project 1'},
                  {value: 'proj2', label: 'Project 2'},
                  {value: 'proj3', label: 'Project 3'}
                ]}
                onChange={this.selectProjectId}
              />
          </div>
          <div className='map-data-model__form-section'>
            <div className='h4-typo'>File Node</div>
              <Select
                className='map-data-model__dropdown introduction'
                value={this.state.nodeType}
                placeholder='Select your node'
                options={[
                  {value: 'node1', label: 'Node 1'},
                  {value: 'node2', label: 'Node 2'},
                  {value: 'node3', label: 'Node 3'},
                  {value: 'node4', label: 'Node 4'},
                ]}
                onChange={this.selectNodeType}
              />
          </div>
          <div className='map-data-model__header'>
            <div className='h3-typo'>Add Details</div>
            <div className='h3-typo'>Step 2 of 2</div>
          </div>
          <div>The Submitter ID is a project-specific node identifier. This property
          is the calling card, nickname, and alias of a submission. It can be used
          in place of the UUID for identifying or recalling a node.</div>
          {
            this.props.filesToMap.map((file, i) => (
              <div key={i} className='map-data-model__file-section'>
                {file}
                <Select
                  className='map-data-model__dropdown'
                  options={[{value: '1', label: 'First'}]}
                />
                <Select
                  className='map-data-model__dropdown'
                  options={[{value: '2', label: 'Second'}]}
                />
              </div>
            ))
          }
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
