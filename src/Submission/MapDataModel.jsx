import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import BackLink from '../components/BackLink';
import getProjectsList from '../Index/relayer';
import RequiredIcon from '../img/icons/required.svg';
import CheckmarkIcon from '../img/icons/status_confirm.svg';
import FileIcon from '../img/icons/file.svg';
import InvalidIcon from '../img/icons/status_wrong.svg';
import { GQLHelper } from '../gqlHelper';
import { fetchQuery } from 'relay-runtime';
import environment from '../environment';
import './MapDataModel.less';

const gqlHelper = GQLHelper.getGQLHelper();

class MapDataModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      nodeType: null,
      submitterId: null,
      parentSubmitterIds: null,
      validIdMap: [],
    }
  }

  componentDidMount() {
    if (this.props.filesToMap.length == 0) {
      this.props.history.push('/submission/files');
    }
    getProjectsList();
    let map = [];
    this.props.filesToMap.forEach(row => {
      map.push([true, true]);
    });
    this.setState({ validIdMap: map });
}

  setSubmitterId = (e, index) => {
    let map = this.state.validIdMap;
    if (!this.submitterIdExists(e.target.value)) {
      map[index][0] = true;
      this.setState({
        submitterId: e.target.value,
        validIdMap: map,
      });
    } else {
      map[index][0] = false;
      this.setState({
        validIdMap: map,
      });
    }
  }

  setParentIds = (e, index) => {
    console.log('e', e.target.value)
    let map = this.state.validIdMap;
    if (this.parentSubmitterIdsAreValid(e.target.value)) {
      map[index][1] = true;
      this.setState({
        parentSubmitterIds: e.target.value,
        validIdMap: map,
      });
    } else {
      map[index][1] = false;
      this.setState({
        validIdMap: map,
      });
    }
  }

  submitterIdExists = id => {
    fetchQuery(
      environment,
      gqlHelper.submitterIdQuery,
      { submitter_id: id, project_id: this.state.project }
    )
      .then(data => {
        if (data && data.datanode) {
          return data.datanode.length > 0;
        }
        return false;
      })
  }

  parentSubmitterIdIsValid = (id, type) => {
    fetchQuery(
      environment,
      gqlHelper.parentSubmitterIdQuery,
      { submitter_id: id, project_id: this.state.project, type: type }
    )
      .then(data => {
        if (data && data.datanode) {
          return data.datanode.length > 0;
        }
        return false;
      })
  }

  parentSubmitterIdsAreValid = ids, type => {
    ids.map(id => {
      if (!this.paremtSubmitterIdIsValid(id, type)) {
        return false;
      }
    })
    return true;
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
          <table className='map-data-model__files-table'>
            <tbody>
              <tr className='map-data-model__files-table-header'>
                <th className='map-data-model__files-table-header-cell'>File Name</th>
                <th className='map-data-model__files-table-header-cell'>Submitter ID</th>
                <th className='map-data-model__files-table-header-cell'>Parent Node of Submitter ID</th>
              </tr>
              {
                this.props.filesToMap.map((file, i) => (
                  <tr key={i} className='map-data-model__file-row'>
                    <td className='map-data-model__file-row-cell map-data-model__icon-cell'>
                      <FileIcon />
                      {file.file_name}
                    </td>
                    <td className='map-data-model__file-row-cell'>
                      <input
                        type='text'
                        className='map-data-model__dropdown'
                        onBlur={(e) => this.setSubmitterId(e, i)}
                      />
                      {
                        this.state.validIdMap[i] && this.state.validIdMap[i][1] == false ? <InvalidIcon /> : null
                      }
                    </td>
                    <td className='map-data-model__file-row-cell'>
                      <Select
                        className='map-data-model__dropdown'
                        options={[{value: '2', label: 'Second'}]}
                        isMulti={true}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

MapDataModel.propTypes = {
  filesToMap: PropTypes.array,
  projects: PropTypes.object,
  dictionary: PropTypes.object,
  nodeTypes: PropTypes.array,
};

MapDataModel.defaultProps = {
  filesToMap: [],
  projects: null,
  dictionary: {},
  nodeTypes: [],
};

export default MapDataModel;
