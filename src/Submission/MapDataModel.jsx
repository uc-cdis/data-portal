import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Button from '@gen3/ui-component/dist/components/Button';
import BackLink from '../components/BackLink';
import getProjectsList from '../Index/relayer';
import RequiredIcon from '../img/icons/required.svg';
import CheckmarkIcon from '../img/icons/status_confirm.svg';
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
      parentNodeType: 'core_metadata_collection',
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
    if (this.state.parentNodeType && this.state.nodeType && this.state.projectId) {
      fetchQuery(
        environment,
        gqlHelper.allSubmitterIdsByTypeQuery,
        { project_id: this.state.project,  type: this.state.parentNodeType }
      ).then(data => {
        if (data && data.datanode) {
          this.setState({ validParentIds: data.datanode });
        }
      })
    } else {
      this.setState({ validParentIds: [] });
    }
  }

  selectNodeType = option => {
    this.setState({ nodeType: option ? option.value : null }, () => {
      this.setRequiredProperties();
      this.selectParentNodeId(null);
      this.fetchAllSubmitterIds();
    });
  }

  selectParentNodeId = option => {
    this.setState({ parentNodeId: option ? option.value : null});
  }

  selectParentNodeType = option => {
    this.setState({
      parentNodeType: option ? option.value : null,
      parentNodeId: null,
    }, this.fetchAllSubmitterIds);
  }

  selectProjectId = option => {
    this.setState({ projectId: option ? option.value : null }, () => {
      this.fetchAllSubmitterIds();
      this.selectParentNodeId(null);
    });
  }

  selectRequiredField = (option, prop) => {
    let fields = this.state.requiredFields;
    fields[prop] = option ? option.value : null;
    this.setState({ requiredFields: fields });
  }

  setRequiredProperties = () => {
    let props = [];
    let map = {};
    if (this.state.nodeType) {
      props = this.props.dictionary[this.state.nodeType].required.filter(prop => prop !== 'submitter_id' &&
        prop !== 'file_size' && prop !== 'file_name' && prop !== 'md5sum' &&
        !this.props.dictionary[this.state.nodeType].systemProperties.includes(prop) &&
        !this.props.dictionary[this.state.nodeType].links.map(link => link.name).includes(prop));
    }
    props.forEach(prop => map[prop] = null);
    this.setState({ requiredFields: map });
  }

  submit = () => {
    console.log('submitting!');
  }

  isValidSubmission = () => {
    return !!this.state.projectId && !!this.state.nodeType &&
      !!this.state.parentNodeType && !!this.state.parentNodeId &&
      !Object.values(this.state.requiredFields).includes(null)
  }

  render() {
    const projectList = this.props.projects ? Object.keys(this.props.projects) : [];
    const projectOptions = projectList.map(key => ({ value: this.props.projects[key].code, label: this.props.projects[key].name }));
    const nodeOptions = this.props.nodeTypes ? this.props.nodeTypes.map(node => ({ value: node, label: node })) : [];
    const linkOptions = this.state.nodeType ?
      this.props.dictionary[this.state.nodeType].links.map(link => ({ value: link.target_type, label: link.name }))
      : [];
    const parentIdOptions = this.state.validParentIds ?
      this.state.validParentIds.map(parent => ({ value: parent.submitter_id, label: parent.submitter_id }))
      : [];

    return (
      <div className='map-data-model'>
        <BackLink url='/submission/files' label='Back to My Files' />
        <div className='h1-typo'>
          Mapping {this.props.filesToMap.length} files to Data Model
        </div>
        <div className='map-data-model__form'>
          <div className='map-data-model__header'>
            <div className='h3-typo'>Assign Project and Node Type</div>
          </div>
          <div className='map-data-model__form-section map-data-model__border-bottom'>
            <div className='h4-typo'>Project</div>
            <InputWithIcon
              inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
              inputValue={this.state.projectId}
              inputPlaceholderText='Select your project'
              inputOptions={projectOptions}
              inputOnChange={this.selectProjectId}
              iconSvg={CheckmarkIcon}
              shouldDisplayIcon={!!this.state.projectId}
            />
          </div>
          <div className='map-data-model__node-form-section map-data-model__border-bottom'>
            <div className='map-data-model__form-section'>
              <div className='h4-typo'>File Node</div>
              <InputWithIcon
                inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
                inputValue={this.state.nodeType}
                inputPlaceholderText='Select your node'
                inputOptions={nodeOptions}
                inputOnChange={this.selectNodeType}
                iconSvg={CheckmarkIcon}
                shouldDisplayIcon={!!this.state.nodeType}
              />
            </div>
            {
              this.state.nodeType && Object.keys(this.state.requiredFields).length > 0 ? (
                <div className='map-data-model__detail-section'>
                  <div className='h4-typo'>Required Fields</div>
                  {
                    Object.keys(this.state.requiredFields).map((prop, i) => {
                      const type = this.props.dictionary[this.state.nodeType].properties[prop];
                      let inputValue = this.state.requiredFields[prop];

                      return (
                        <div key={i} className='map-data-model__required-field'>
                          <div className='map-data-model__required-field-info'>
                            <RequiredIcon />
                            <div className='h4-typo'>{prop}</div>
                          </div>
                          {
                            type['enum'] ?
                              <InputWithIcon
                                inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
                                inputValue={inputValue}
                                inputPlaceholderText='Select your field'
                                inputOptions={type['enum'].map(option => ({ value: option, label: option }))}
                                inputOnChange={(e) => this.selectRequiredField(e, prop)}
                                iconSvg={CheckmarkIcon}
                                shouldDisplayIcon={!!this.state.requiredFields[prop]}
                              />
                              : <InputWithIcon
                                  inputClassName='map-data-model__input map-data-model__input--required introduction'
                                  inputValue={inputValue}
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
          <div className='map-data-model__node-form-section map-data-model__border-bottom'>
            <div className='map-data-model__form-section map-data-model__parent-section'>
              <div className='h4-typo'>Link(s) to Parent Node(s)</div>
            </div>
            <div className='map-data-model__required-field map-data-model__parent-id-section'>
              <div className='map-data-model__required-field-info'>
                <RequiredIcon />
                <div className='h4-typo'>{this.state.parentNodeType}</div>
              </div>
              {
                parentIdOptions ?
                  <InputWithIcon
                    inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
                    inputValue={this.state.parentNodeId}
                    inputPlaceholderText='Select your parent node ID'
                    inputOptions={parentIdOptions}
                    inputOnChange={this.selectParentNodeId}
                    iconSvg={CheckmarkIcon}
                    shouldDisplayIcon={!!this.state.parentNodeId}
                  />
                : <p>No available collections to link to. Please create a
                {this.state.parentNodeType} node on this project to continue. </p>
            }
            </div>
          </div>
        </div>
        {
          this.isValidSubmission() ? (
            <div className='map-data-model__submission-footer'>
              <Button
                onClick={this.submit}
                label='Submit'
                buttonType='primary'
              />
              <p className='map-data-model__submission-footer-text introduction'>
                {this.props.filesToMap.length} files ready for mapping.
              </p>
            </div>
          ) : null
        }
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
