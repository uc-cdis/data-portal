import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { fetchQuery } from 'relay-runtime';
import Button from '../gen3-ui-component/components/Button';
import Toaster from '../gen3-ui-component/components/Toaster';
import BackLink from '../components/BackLink';
import { getProjectsList } from './relayer';
import CheckmarkIcon from '../img/icons/status_confirm.svg';
import InputWithIcon from '../components/InputWithIcon';
import GQLHelper from '../gqlHelper';
import environment from '../environment';
import sessionMonitor from '../SessionMonitor';
import { headers, submissionApiPath } from '../localconf';
import './MapDataModel.css';

const gqlHelper = GQLHelper.getGQLHelper();
const CHUNK_SIZE = 10;

export function isValidSubmission(state) {
  return (
    !!state.projectId &&
    !!state.nodeType &&
    !!state.parentNodeType &&
    !!state.parentNodeId &&
    Object.values(state.requiredFields).filter(
      (value) => value === null || value === ''
    ).length === 0
  );
}

/**
 * @typedef {Object} Link
 * @property {string} name
 * @property {string} target_type
 * @property {Link[]} subgroup
 */

/**
 * @param {Link[]} links
 * @param {{ [type: string]: Link }} parents
 */
export function getParentNodes(links, parents) {
  let parentNodes = { ...parents };
  for (const link of links)
    if (link.subgroup) {
      parentNodes = getParentNodes(link.subgroup, parentNodes);
    } else {
      parentNodes[link.target_type] = link;
    }

  return parentNodes;
}

/**
 *
 * @param {Object} dictionary
 * @param {string} nodeType
 * @param {{ [x: string]: { name: string }}} parentTypes
 */
function getRequiredFields(dictionary, nodeType, parentTypes) {
  const fields = /** @type {{ [x: string]: any }} */ ({});
  if (nodeType) {
    const { required, systemProperties } = dictionary[nodeType];
    const ignoredProperties = [
      'file_size',
      'file_name',
      'md5sum',
      'submitter_id',
      'type',
      ...systemProperties,
    ];

    for (const prop of required)
      if (
        !ignoredProperties.includes(prop) &&
        !Object.keys(parentTypes)
          .map((key) => parentTypes[key].name)
          .includes(prop)
      )
        fields[prop] = null;
  }

  return fields;
}

/**
 * @param {Object} args
 * @param {string} args.nodeType
 * @param {string} args.parentNodeType
 * @param {{ [x: string]: Link }} args.parentTypesOfSelectedNode
 * @param {string} args.projectId
 * @param {React.Dispatch<React.SetStateAction<any[]>>} args.setValidParentIds
 */
function fetchAllSubmitterIds({
  nodeType,
  parentNodeType,
  parentTypesOfSelectedNode,
  projectId,
  setValidParentIds,
}) {
  if (
    nodeType &&
    parentNodeType &&
    parentTypesOfSelectedNode[parentNodeType] &&
    projectId
  ) {
    fetchQuery(environment, gqlHelper.allSubmitterIdsByTypeQuery, {
      project_id: projectId,
    }).subscribe({
      next: (data) => {
        if (data?.[parentNodeType]) setValidParentIds(data[parentNodeType]);
      },
    });
  } else {
    setValidParentIds([]);
  }
}

/**
 * @param {Object} args
 * @param {Object[]} args.filesToMap
 * @param {string} args.nodeType
 * @param {string} args.parentNodeId
 * @param {string} args.parentNodeType
 * @param {{ [x: string]: Link }} args.parentTypesOfSelectedNode
 * @param {string} args.projectId
 * @param {{ [x: string]: any }} args.requiredFields
 */
function getFileChunksToSubmit({
  filesToMap,
  nodeType,
  parentNodeId,
  parentNodeType,
  parentTypesOfSelectedNode,
  projectId,
  requiredFields,
}) {
  const fileChunks = [];

  let files = [];
  for (const file of filesToMap) {
    files.push({
      ...requiredFields,
      file_name: file.file_name,
      file_size: file.size,
      md5sum: file.hashes?.md5 ?? null,
      object_id: file.did,
      project_id: projectId,
      submitter_id: `${projectId}_${file.file_name.substring(
        0,
        file.file_name.lastIndexOf('.')
      )}_${file.did.substring(file.did.length - 4, file.did.length)}`,
      type: nodeType,
      [parentTypesOfSelectedNode[parentNodeType].name]: {
        submitter_id: parentNodeId,
      },
    });

    if (files.length === CHUNK_SIZE) {
      fileChunks.push(files);
      files = [];
    }
  }

  if (files.length > 0) fileChunks.push(files);

  return fileChunks;
}

/**
 * @param {string} program
 * @param {string} project
 * @param {Object[]} files
 */
function submitFilesToMap(program, project, files) {
  return fetch(`${submissionApiPath}${program}/${project}`, {
    credentials: 'include',
    headers,
    method: 'POST',
    body: JSON.stringify(files),
  })
    .then((response) => response.text())
    .then((responseBody) => {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });
}

/**
 * @param {Object} props
 * @param {Object} [props.dictionary]
 * @param {Object[]} [props.filesToMap]
 * @param {string[]} [props.nodeTypes]
 * @param {Object} [props.projects]
 * @param {Function} [props.submitFiles]
 */
function MapDataModel({
  dictionary = {},
  filesToMap = [],
  nodeTypes = [],
  projects = null,
  submitFiles = submitFilesToMap,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (filesToMap.length === 0) navigate('/submission/files');
    getProjectsList();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodeType, setNodeType] = useState(null);
  const [parentNodeId, setParentNodeId] = useState(null);
  const [parentNodeType] = useState('core_metadata_collection');
  const [parentTypesOfSelectedNode, setParentTypesOfSelectedNode] = useState(
    {}
  );
  const [projectId, setProjectId] = useState(null);
  const [requiredFields, setRequiredFields] = useState({});
  const [submissionText, setSubmissionText] = useState(
    `${filesToMap.length} files ready for mapping.`
  );
  const [validParentIds, setValidParentIds] = useState([]);

  /** @param {{ label: string; value: string }} option */
  function haneldSelectNodeType(option) {
    const newNodeType = option?.value ?? null;
    const newParentTypes = option
      ? getParentNodes(dictionary[option.value].links, {})
      : {};

    setNodeType(newNodeType);
    setParentTypesOfSelectedNode(newParentTypes);
    setRequiredFields(getRequiredFields(dictionary, nodeType, newParentTypes));
    setParentNodeId(null);

    fetchAllSubmitterIds({
      nodeType: newNodeType,
      parentNodeType,
      parentTypesOfSelectedNode: newParentTypes,
      projectId,
      setValidParentIds,
    });
  }

  /** @param {{ label: string; value: string }} option */
  function handleSelectParentNodeId(option) {
    setParentNodeId(option?.value ?? null);
  }

  /** @param {{ label: string; value: string }} option */
  function handleSelectProjectId(option) {
    const newProjectId = option?.value ?? null;
    setProjectId(newProjectId);
    setParentNodeId(null);

    fetchAllSubmitterIds({
      nodeType,
      parentNodeType,
      parentTypesOfSelectedNode,
      projectId: newProjectId,
      setValidParentIds,
    });
  }

  /**
   * @param {any} value
   * @param {string} prop
   */
  function parseFieldValue(value, prop) {
    const { type } = dictionary[nodeType]?.properties?.[prop];
    if (type === 'number') return parseFloat(value);
    if (type === 'integer') return parseInt(value, 10);
    return value;
  }

  /**
   * @param {Object} option
   * @param {string} prop
   */
  function handleSelectRequiredField(option, prop) {
    const { target, value } = option ?? {};
    // eslint-disable-next-line no-nested-ternary
    const fieldValue = target
      ? parseFieldValue(target.value, prop)
      : value
      ? parseFieldValue(value, prop)
      : null;

    setRequiredFields((fields) => ({ ...fields, [prop]: fieldValue || null }));
  }

  function handleSubmit() {
    const fileChunks = getFileChunksToSubmit({
      filesToMap,
      nodeType,
      parentNodeId,
      parentNodeType,
      parentTypesOfSelectedNode,
      projectId,
      requiredFields,
    });

    const programProject = projectId.split(/-(.+)/);
    let message = `${filesToMap.length} files mapped successfully!`;
    setIsSubmitting(true);

    const promises = fileChunks.map((files, index) =>
      submitFiles(programProject[0], programProject[1], files).then((res) => {
        setSubmissionText(
          `Submitting ${index + 1} of ${fileChunks.length} chunks...`
        );

        if (!res.success) {
          const { errors } = res.entities?.[0] ?? {};
          message = `Error: ${
            errors?.map((err) => err.message)?.toString() ?? res.message
          } occurred during mapping.`;
        }
        sessionMonitor.updateUserActivity();
      })
    );

    Promise.all(promises).then(() =>
      navigate(`/submission/files?message=${message}`)
    );
  }

  const projectOptions = Object.keys(projects ?? {}).map((key) => ({
    value: projects[key].name,
    label: projects[key].name,
  }));
  const nodeOptions = (nodeTypes ?? [])
    .filter((node) => dictionary[node]?.category?.endsWith('_file'))
    .map((node) => ({
      value: node,
      label: node,
    }));
  const parentIdOptions = (validParentIds ?? []).map((parent) => ({
    value: parent.submitter_id,
    label: parent.submitter_id,
  }));

  return (
    <div className='map-data-model'>
      <BackLink url='/submission/files' label='Back to My Files' />
      <div className='h1-typo'>
        Mapping {filesToMap.length} files to Data Model
      </div>
      <div className='map-data-model__form'>
        <div className='map-data-model__header'>
          <div className='h3-typo'>Assign Project and Node Type</div>
        </div>
        <div className='map-data-model__form-section map-data-model__border-bottom'>
          <label className='h4-typo' htmlFor='project'>
            Project
          </label>
          <InputWithIcon
            inputId='project'
            inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
            inputValue={projectId}
            inputPlaceholderText='Select your project'
            inputOptions={projectOptions}
            inputOnChange={handleSelectProjectId}
            iconSvg={CheckmarkIcon}
            shouldDisplayIcon={!!projectId}
          />
        </div>
        <div className='map-data-model__node-form-section map-data-model__border-bottom'>
          <div className='map-data-model__form-section'>
            <label className='h4-typo' htmlFor='file-node'>
              File Node
            </label>
            <InputWithIcon
              inputId='file-node'
              inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
              inputValue={nodeType}
              inputPlaceholderText='Select your node'
              inputOptions={nodeOptions}
              inputOnChange={haneldSelectNodeType}
              iconSvg={CheckmarkIcon}
              shouldDisplayIcon={!!nodeType}
            />
          </div>
          {nodeType && Object.keys(requiredFields).length > 0 ? (
            <div className='map-data-model__detail-section'>
              <div className='h4-typo'>Required Fields</div>
              {Object.keys(requiredFields).map((prop) => {
                const type = dictionary[nodeType].properties[prop];
                const inputValue = requiredFields[prop]?.toString();

                return (
                  <div key={prop} className='map-data-model__required-field'>
                    <div className='map-data-model__required-field-info'>
                      <i className='g3-icon g3-icon--star' />
                      <label className='h4-typo' htmlFor={prop}>
                        {prop}
                      </label>
                    </div>
                    {type?.enum ? (
                      <InputWithIcon
                        inputId={prop}
                        inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
                        inputValue={inputValue}
                        inputPlaceholderText='Select your field'
                        inputOptions={type.enum.map((option) => ({
                          value: option,
                          label: option,
                        }))}
                        inputOnChange={(e) =>
                          handleSelectRequiredField(e, prop)
                        }
                        iconSvg={CheckmarkIcon}
                        shouldDisplayIcon={!!requiredFields[prop]}
                      />
                    ) : (
                      <InputWithIcon
                        inputId={prop}
                        inputClassName='map-data-model__input introduction'
                        inputValue={inputValue}
                        inputOnChange={(e) =>
                          handleSelectRequiredField(e, prop)
                        }
                        iconSvg={CheckmarkIcon}
                        shouldDisplayIcon={!!requiredFields[prop]}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className='map-data-model__node-form-section map-data-model__border-bottom'>
          <div className='map-data-model__form-section map-data-model__parent-section'>
            <div className='h4-typo'>Link(s) to Parent Node(s)</div>
          </div>
          <div className='map-data-model__required-field map-data-model__parent-id-section'>
            <div className='map-data-model__required-field-info'>
              <i className='g3-icon g3-icon--star' />
              <div className='h4-typo'>{parentNodeType}</div>
            </div>
            {parentIdOptions.length > 0 ? (
              <InputWithIcon
                inputClassName='map-data-model__dropdown map-data-model__dropdown--required introduction'
                inputValue={parentNodeId}
                inputPlaceholderText='Select your parent node ID'
                inputOptions={parentIdOptions}
                inputOnChange={handleSelectParentNodeId}
                iconSvg={CheckmarkIcon}
                shouldDisplayIcon={!!parentNodeId}
              />
            ) : (
              <p className='map-data-model__missing-node'>
                No available collections to link to. Please create a &nbsp;{' '}
                {parentNodeType} node on this project to continue.
              </p>
            )}
          </div>
        </div>
      </div>
      <Toaster
        isEnabled={isValidSubmission({
          nodeType,
          parentNodeType,
          parentNodeId,
          projectId,
          requiredFields,
        })}
        className={'map-data-model__submission-toaster-div'}
      >
        <Button
          onClick={handleSubmit}
          label='Submit'
          buttonType='primary'
          enabled={!isSubmitting}
        />
        <p className='map-data-model__submission-footer-text introduction'>
          {submissionText}
        </p>
      </Toaster>
    </div>
  );
}

MapDataModel.propTypes = {
  dictionary: PropTypes.object,
  filesToMap: PropTypes.array,
  nodeTypes: PropTypes.array,
  projects: PropTypes.object,
  submitFiles: PropTypes.func,
};

export default MapDataModel;
