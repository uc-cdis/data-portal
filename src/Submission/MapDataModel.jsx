import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import BackLink from '../components/BackLink';
import getProjectsList from '../Index/relayer';
import RequiredIcon from '../img/icons/required.svg';
import CheckmarkIcon from '../img/icons/status_confirm.svg';
import FileIcon from '../img/icons/file.svg';
import InvalidIcon from '../img/icons/status_wrong.svg';
import OpenIcon from '../img/icons/open.svg';
import CloseIcon from '../img/icons/close.svg';
import InputWithIcon from '../components/InputWithIcon';
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
      requiredFields: {},
      parentNodeType: null,
      parentNodeId: null,
      validParentIds: [],
    }
  }

  componentDidMount() {
    if (this.props.filesToMap.length == 0) {
      this.props.history.push('/submission/files');
    }
    getProjectsList();
  }

  fetchAllSubmitterIds = () => {
    let ids = [];
    if (this.state.parentNodeType && this.state.nodeType && this.state.projectId) {
      fetchQuery(
        environment,
        gqlHelper.allSubmitterIdsByTypeQuery,
        { project_id: this.state.project,  type: this.state.parentNodeType }
      ).then(data => {
        console.log('data', data)
        if (data && data.datanode) {
          ids = data;
        }
      })
    }
    this.setState({ validParentIds: ids }, () => console.log('data', this.state.validParentIds));
  }

  selectNodeType = option => {
    this.setState({ nodeType: option ? option.value : null }, this.fetchAllSubmitterIds);
  }

  selectParentNodeId = option => {
    this.setState({ parentNodeId: option ? option.value : null});
  }

  selectParentNodeType = option => {
    this.setState({ parentNodeType: option ? option.value : null }, this.fetchAllSubmitterIds);
  }

  selectProjectId = option => {
    this.setState({ projectId: option ? option.value : null }, this.fetchAllSubmitterIds);
  }

  selectRequiredField = (option, prop) => {
    let fields = this.state.requiredFields;
    fields[prop] = option ? option.value : null;
    this.setState({ requiredFields: fields });
  }

  render() {
    console.log('node types', this.props.nodeTypes)
    console.log('dictionary', this.props.dictionary)
    const projectList = this.props.projects ? Object.keys(this.props.projects) : [];
    const projectOptions = projectList.map(key => ({ value: this.props.projects[key].code, label: this.props.projects[key].name }));
    const nodeOptions = this.props.nodeTypes ? this.props.nodeTypes.map(node => ({ value: node, label: node })) : [];
    const requiredNodeProperties = this.state.nodeType ?
      this.props.dictionary[this.state.nodeType].required.filter(prop => prop !== 'submitter_id' &&
        !this.props.dictionary[this.state.nodeType].systemProperties.includes(prop) &&
        !this.props.dictionary[this.state.nodeType].links.map(link => link.name).includes(prop))
      : null;
    const linkOptions = this.state.nodeType ?
      this.props.dictionary[this.state.nodeType].links.map(link => ({ value: link.target_type, label: link.name }))
      : null
    console.log('requiredFields', this.state.requiredFields);

    return (
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
            <InputWithIcon
              inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
              inputValue={this.state.projectId}
              inputPlaceholderText='Select your project'
              inputOptions={projectOptions}
              inputOnChange={this.selectProjectId}
              iconSvg={CheckmarkIcon}
              shouldDisplayIcon={this.state.projectId !== null}
            />
          </div>
          <div className='map-data-model__node-form-section'>
            <div className='map-data-model__form-section'>
              <div className='h4-typo'>File Node</div>
              <InputWithIcon
                inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
                inputValue={this.state.nodeType}
                inputPlaceholderText='Select your node'
                inputOptions={nodeOptions}
                inputOnChange={this.selectNodeType}
                iconSvg={CheckmarkIcon}
                shouldDisplayIcon={this.state.nodeType !== null}
              />
            </div>
            {
              requiredNodeProperties ? (
                <div className='map-data-model__required-fields-section'>
                  <div className='h4-typo'>Required Fields</div>
                  {
                    requiredNodeProperties.map((prop, i) => {
                      const type = this.props.dictionary[this.state.nodeType].properties[prop];
                      console.log('checkmark?', this.state.requiredFields[prop])
                      return (
                        <div key={i} className='map-data-model__required-field'>
                          <RequiredIcon />
                          <div className='h4-typo'>{prop}</div>
                          {
                            type['enum'] ?
                              <InputWithIcon
                                inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
                                inputValue={this.state.requiredFields[prop]}
                                inputPlaceholderText='Select your field'
                                inputOptions={type['enum'].map(option => ({ value: option, label: option }))}
                                inputOnChange={(e) => this.selectRequiredField(e, prop)}
                                iconSvg={CheckmarkIcon}
                                shouldDisplayIcon={!!this.state.requiredFields[prop]}
                              />
                              : <InputWithIcon
                                inputClassName='map-data-model__input map-data-model__input--required introduction'
                                inputValue={this.state.requiredFields[prop]}
                                inputOnChange={(e) => this.selectRequiredField(e, prop)}
                                iconSvg={CheckmarkIcon}
                                shouldDisplayIcon={!!this.state.requiredFields[prop]}
                              />
                          }
                        </div>
                      )
                    })
                  }
                </div>
              ) : null
            }
          </div>
          <div className='map-data-model__node-form-section'>
            <div className='map-data-model__form-section'>
              <div className='h4-typo'>Link(s) to Parent Node(s)</div>
              <InputWithIcon
                inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
                inputValue={this.state.parentNodeType}
                inputPlaceholderText='Select your parent node type'
                inputOptions={linkOptions}
                inputOnChange={this.selectParentNodeType}
                iconSvg={CheckmarkIcon}
                shouldDisplayIcon={this.state.parentNodeType !== null}
              />
            </div>
            <div className='map-data-model__required-fields-section'>
            <InputWithIcon
              inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
              inputValue={this.state.parentNodeId}
              inputPlaceholderText='Select your parent node ID'
              inputOptions={this.state.validParentIds}
              inputOnChange={this.selectParentNodeId}
              iconSvg={CheckmarkIcon}
              shouldDisplayIcon={this.state.parentNodeId !== null}
            />
            </div>
          </div>
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
