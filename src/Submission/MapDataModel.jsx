import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import BackLink from '../components/BackLink';
import getProjectsList from '../Index/relayer';
import RequiredIcon from '../img/icons/required.svg';
import CheckmarkIcon from '../img/icons/status_confirm.svg';
import './MapDataModel.less';

class MapDataModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      nodeType: null,
    }
  }

  componentDidMount() {
    getProjectsList();
  }

  selectProjectId = option => {
    this.setState({ projectId: option ? option.value : null });
  }

  selectNodeType = option => {
    this.setState({ nodeType: option ? option.value : null });
  }

  render() {
    const projectList = this.props.projects ? Object.keys(this.props.projects) : [];
    const projectOptions = projectList.map(key => ({ value: this.props.projects[key].code, label: this.props.projects[key].name }));
    const nodeOptions = this.props.nodeTypes ? this.props.nodeTypes.map(node => ({ value: node, label: node })) : [];
    const requiredNodeProperties = this.state.nodeType ? this.props.dictionary[this.state.nodeType].required : null;
    console.log('node options', this.props.dictionary[this.state.nodeType])
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
            <div className='map-data-model__dropdown-section'>
              <Select
                className='map-data-model__dropdown map-data-model__dropdown--required introduction'
                value={this.state.projectId}
                placeholder={'Select your project'}
                options={projectOptions}
                onChange={this.selectProjectId}
              />
              { this.state.projectId ? <CheckmarkIcon className='map-data-model__checkmark'/> : null }
            </div>
          </div>
          <div className='map-data-model__node-form-section'>
            <div className='map-data-model__form-section'>
              <div className='h4-typo'>File Node</div>
              <div className='map-data-model__dropdown-section'>
                <Select
                  className='map-data-model__dropdown introduction'
                  value={this.state.nodeType}
                  placeholder='Select your node'
                  options={nodeOptions}
                  onChange={this.selectNodeType}
                />
                { this.state.nodeType ? <CheckmarkIcon className='map-data-model__checkmark'/> : null }
              </div>
            </div>
            {
              requiredNodeProperties ? (
                <div className='map-data-model__required-fields-section'>
                  <div className='h4-typo'>Required Fields</div>
                  {
                    requiredNodeProperties.map((prop, i) =>
                      <div key={i} className='map-data-model__required-field'>
                        <RequiredIcon />
                        <div className='h4-typo'>{prop}</div>
                      </div>
                  )}
                </div>
              ) : null
            }
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
