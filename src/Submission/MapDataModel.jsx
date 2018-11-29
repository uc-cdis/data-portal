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
import OneOfInput from './OneOfInput';
import EnumInput from './EnumInput';
import AnyOfInput from './AnyOfInput';
import TextInput from './TextInput';
import './MapDataModel.less';

const gqlHelper = GQLHelper.getGQLHelper();

class MapDataModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      nodeType: null,
      submitterIds: null,
      parentSubmitterIds: null,
      validIdMap: [],
      optionalSectionIsOpen: false,
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

  fetchAllSubmitterIds = () => {
    let map = {};
    fetchQuery(
      environment,
      gqlHelper.allSubmitterIdsQuery,
      { project_id: this.state.project }
    ).then(data => {
      if (data && data.datanode) {
        console.log('data!', data)
        data.datanode.forEach(elt => {
          console.log('elt')
          if (map[elt.submitter_id]) {
            map[elt.submitter_id] = map[elt.submitter_id].concat(elt.type)
          } else {
            map[elt.submitter_id] = [elt.type]
          }
        })
      }
      console.log('map', map)
    })
  }

  getInputType = (key, requiredNodeProperties) => {
    let property = this.props.dictionary[this.state.nodeType].properties[key];
    console.log('property', property);
    let description = ('description' in property) ? property.description : '';
    if (description === '') {
      description = ('term' in property) ? property.term.description : '';
    }

    const isRequired = requiredNodeProperties.includes(key);
    console.log('required?', isRequired);

    if (property === 'type') {
      return null;
    } else if ('enum' in property) {
      return (
        <EnumInput
          key={key}
          name={key}
          options={property.enum}
          onChange={() => console.log('change enum')}
          required={isRequired}
          onUpdateFormSchema={() => console.log('update enum')}
          propertyType='string'
          description={description}
        />);
    } else if ('oneOf' in property) {
      return (
        <OneOfInput
          key={key}
          value={key}
          property={property.oneOf}
          name={key}
          required={isRequired}
          description={description}
          onChange={() => console.log('change one of')}
          onChangeEnum={() => console.log('change one of')}
          onUpdateFormSchema={() => console.log('update one of')}
        />);
    } else if ('anyOf' in property) {
      return (
        <AnyOfInput
          key={key}
          values={'Hey'}
          name={key}
          node={property.anyOf[0].items}
          properties={Object.keys(property.anyOf[0].items.properties)}
          required={isRequired}
          requireds={[]}
          onChange={() => console.log('change any of')}
        />
      );
    }
    let propertyType = property.type;
    if (typeof (propertyType) === 'object') {
      /* just use the first type if it allows multiple types */
      propertyType = propertyType[0];
    }
    return (
      <TextInput
        key={key}
        name={key}
        onUpdateFormSchema={() => console.log('update text')}
        propertyType={propertyType}
        value={'Hi'}
        required={isRequired}
        description={description}
        onChange={() => console.log('change text')}
      />);
  }

  getOptionalNodeProperties = requiredNodeProperties => {
    const properties = this.props.dictionary[this.state.nodeType].properties;
    let temp = Object.keys(properties)
      .filter(key => {
        return !requiredNodeProperties.includes(key)
      })
      .reduce((obj, key) => {
        obj[key] = properties[key];
        return obj;
      }, {});

    console.log('temp', temp)
    return temp;
  }

  setSubmitterId = (e, index) => {
    let id = e.target.value;
    let map = this.state.validIdMap;
    fetchQuery(
      environment,
      gqlHelper.submitterIdQuery,
      { submitter_id: id, project_id: this.state.project }
    )
      .then(data => {
        if (data && data.datanode && data.datanode.length > 0) {
          map[index][0] = false;
          this.setState({
            validIdMap: map,
          });
        } else {
          map[index][0] = true;
          this.setState({
            submitterId: id,
            validIdMap: map,
          });
        }
      })
  }

  setParentIds = (e, index) => {
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
    let exists = false;
    fetchQuery(
      environment,
      gqlHelper.parentSubmitterIdQuery,
      { submitter_id: id, project_id: this.state.project, type: type }
    )
      .then(data => {
        if (data && data.datanode && data.datanode.length > 0) {
          exists = true;
        }
      })
    return exists;
  }

  parentSubmitterIdsAreValid = (ids, type) => {
    ids.map(id => {
      if (!this.parentSubmitterIdIsValid(id, type)) {
        return false;
      }
    })
    return true;
  }

  selectProjectId = option => {
    this.setState({ projectId: option ? option.value : null }, this.fetchAllSubmitterIds());
  }

  selectNodeType = option => {
    this.setState({ nodeType: option ? option.value : null });
  }

  toggleOptionalSection = () => {
    this.setState({ optionalSectionIsOpen: !this.state.optionalSectionIsOpen });
  }

  render() {
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
              iconClassName='map-data-model__checkmark'
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
                iconClassName='map-data-model__checkmark'
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
                  <div
                    onClick={this.toggleOptionalSection}
                    role='button'
                  >
                    <div className='map-data-model__optional-fields-button introduction'>
                      {
                        this.state.optionalSectionIsOpen ? (
                        <React.Fragment>
                          <CloseIcon /> Close Optional Fields
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <OpenIcon /> Open Optional Fields
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                  {
                    this.state.optionalSectionIsOpen ? Object.keys(optionalNodeProperties).map((key, i) => (
                      <div key={i} className='map-data-model__required-field'>
                        <div className='h4-typo'>{key}</div>
                        {
                          this.getInputType(key, requiredNodeProperties)
                        }
                      </div>
                    )) : null
                  }
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
                {
                  this.state.nodeType ? this.props.dictionary[this.state.nodeType].links.map((link, i) =>
                    <th key={i} className='map-data-model__files-table-header-cell'>{link.name}</th>
                  ) : null
                }
              </tr>
              {
                this.props.filesToMap.map((file, i) => {
                  const submitterIdIsValid = this.state.validIdMap[i] && this.state.validIdMap[i][0];
                  const parentSubmitterIdsAreValid = this.state.validIdMap[i] && this.state.validIdMap[i][1];
                  return (
                    <tr key={i} className='map-data-model__file-row'>
                      <td className='map-data-model__file-row-cell map-data-model__icon-cell'>
                        <FileIcon />
                        {file.file_name}
                      </td>
                      <td className='map-data-model__file-row-cell'>
                        <InputWithIcon
                          inputClassName={'map-data-model__input'.concat(!submitterIdIsValid ? ' red-border' : '')}
                          inputOnChange={(e) => this.setSubmitterId(e, i)}
                          iconSvg={InvalidIcon}
                          shouldDisplayIcon={!submitterIdIsValid}
                          shouldDisplayText={!submitterIdIsValid }
                          text='This submitter ID has been used.'
                          textClassName='invalid-text body-typo'
                        />
                      </td>
                      {
                        this.state.nodeType ? this.props.dictionary[this.state.nodeType].links.map((link, i) => (
                          <td key={i} className='map-data-model__file-row-cell'>
                            <InputWithIcon
                              inputClassName={'map-data-model__input'.concat(!parentSubmitterIdsAreValid ? ' red-border' : '')}
                              inputOnChange={(e) => this.setParentIds(e, i)}
                              iconSvg={InvalidIcon}
                              shouldDisplayIcon={!parentSubmitterIdsAreValid}
                              shouldDisplayText={!parentSubmitterIdsAreValid}
                              text='One or more of these parent IDs does not exist.'
                              textClassName='invalid-text body-typo'
                            />
                          </td>
                        )) : null
                      }
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
