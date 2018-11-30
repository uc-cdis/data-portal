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
      submissions: {},
      existingSubmitterIds: new Set(),
      submitterIdsByType: {},
      optionalSectionIsOpen: false,
    }
  }

  componentDidMount() {
    if (this.props.filesToMap.length == 0) {
      this.props.history.push('/submission/files');
    }
    getProjectsList();
    let submissions = {};
    this.props.filesToMap.forEach(file => {
      submissions[file.did] = {
        submitterId: null,
        parentSubmitterIds: {},
      }
    });
    this.setState({ submissions: submissions });
  }

  fetchAllSubmitterIds = () => {
    let map = {};
    let set = new Set();
    fetchQuery(
      environment,
      gqlHelper.allSubmitterIdsQuery,
      { project_id: this.state.project }
    ).then(data => {
      if (data && data.datanode) {
        data.datanode.forEach(elt => {
          set.add(elt.submitter_id);
          if (!map[elt.type]) {
            map[elt.type] = new Set();
          }
          map[elt.type] = map[elt.type].add(elt.submitter_id);
        })
      }
      this.setState({ existingSubmitterIds: set, submitterIdsByType: map }, () => console.log('map', map, 'set', set));
    })
  }

  getOptionalNodeProperties = requiredNodeProperties => {
    const properties = this.props.dictionary[this.state.nodeType].properties;
    return Object.keys(properties)
      .filter(key => {
        return !requiredNodeProperties.includes(key)
      })
      .reduce((obj, key) => {
        obj[key] = properties[key];
        return obj;
      }, {});
  }

  parentSubmitterIdsAreValid = (index, type) => {
    let id = this.state.submissions[index] ? this.state.submissions[index].parentSubmitterIds[type] : [];
      if (!(this.state.existingSubmitterIds.has(id) &&
            this.state.submitterIdsByType[type] &&
            this.state.submitterIdsByType[type].has(id))) {
        return false;
      }
    return true;
  }

  selectProjectId = option => {
    this.setState({ projectId: option ? option.value : null }, this.fetchAllSubmitterIds());
  }

  selectNodeType = option => {
    this.setState({ nodeType: option ? option.value : null });
  }

  setParentIds = (options, index, type) => {
    let submissions = this.state.submissions;
    submissions[index].parentSubmitterIds[type] = options;
    this.setState({ submissions: submissions });
  }

  setSubmitterId = (e, index) => {
    let id = e.target.value;
    let submissions = this.state.submissions;
    submissions[index].submitterId = id;
    this.setState({ submissions: submissions });
  }

  submitterIdExists = index => {
    let id = this.state.submissions[index] ? this.state.submissions[index].submitterId : null;
    if (id && this.state.existingSubmitterIds.has(id)) {
      return true;
    }
    return false;
  }

  toggleOptionalSection = () => {
    this.setState({ optionalSectionIsOpen: !this.state.optionalSectionIsOpen });
  }

  render() {
    console.log('submission:', this.state.submissions)
    const projectList = this.props.projects ? Object.keys(this.props.projects) : [];
    const projectOptions = projectList.map(key => ({ value: this.props.projects[key].code, label: this.props.projects[key].name }));
    const nodeOptions = this.props.nodeTypes ? this.props.nodeTypes.map(node => ({ value: node, label: node })) : [];
    const requiredNodeProperties = this.state.nodeType ? this.props.dictionary[this.state.nodeType].required : null;
    const optionalNodeProperties = this.state.nodeType ? this.getOptionalNodeProperties(requiredNodeProperties) : null;
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
          <div className='map-data-model__details introduction'>The Submitter ID is a project-specific node identifier. This property
          is the calling card, nickname, and alias of a submission. It can be used
          in place of the UUID for identifying or recalling a node.</div>
          <table className='map-data-model__files-table'>
            <tbody>
              <tr className='map-data-model__files-table-header'>
                <th className='map-data-model__files-table-header-cell'>File Name</th>
                <th className='map-data-model__files-table-header-cell'>Submitter ID</th>
                <th className='map-data-model__files-table-header-cell'>Link(s) to Parent Node</th>
              </tr>
              {
                this.props.filesToMap.map(file => {
                  const submitterIdIsValid = !this.submitterIdExists(file.did);
                  return (
                    <tr key={file.did} className='map-data-model__file-row'>
                      <td className='map-data-model__file-row-cell map-data-model__icon-cell'>
                        <FileIcon />
                        {file.file_name}
                      </td>
                      <td className='map-data-model__file-row-cell'>
                        <InputWithIcon
                          inputClassName={'map-data-model__input map-data-model__input--required'.concat(!submitterIdIsValid ? ' red-border' : '')}
                          inputOnChange={(e) => this.setSubmitterId(e, file.did)}
                          iconSvg={InvalidIcon}
                          shouldDisplayIcon={!submitterIdIsValid}
                          shouldDisplayText={!submitterIdIsValid}
                          text='This submitter ID has been used.'
                          textClassName='invalid-text body-typo'
                        />
                      </td>
                      <td className='map-data-model__file-row-cell'>
                      {
                        this.state.projectId && this.state.nodeType ? this.props.dictionary[this.state.nodeType].links.map(link => {
                          const parentSubmitterIdsAreValid = this.parentSubmitterIdsAreValid(file.did, link.target_type);
                          const submitterIds = this.state.submitterIdsByType[link.target_type];
                          const options = submitterIds ? Array.from(submitterIds).map(id => ({ value: id, label: id })) : [];
                          const selectedIds = this.state.submissions[file.did] && this.state.submissions[file.did].parentSubmitterIds[link.target_type]
                            ? this.state.submissions[file.did].parentSubmitterIds[link.target_type]
                            : null
                          return (
                            <React.Fragment key={`${file.did}-${link.target_type}`}>
                              <p>{link.name}</p>
                              <InputWithIcon
                                inputClassName={'map-data-model__dropdown--required'.concat(!parentSubmitterIdsAreValid ? ' red-border' : '')}
                                inputOptions={options}
                                inputOnChange={(option) => this.setParentIds(option, file.did, link.target_type)}
                                inputValue={selectedIds}
                                iconSvg={InvalidIcon}
                                text='One or more of these parent IDs does not exist.'
                                textClassName='invalid-text body-typo'
                                isMulti={link.multiplicity !== 'one_to_one'}
                              />
                            </React.Fragment>
                          )
                        }) : null
                      }
                    </td>
                  </tr>
                )
              })
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
