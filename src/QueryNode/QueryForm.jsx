import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import Dropdown from '../gen3-ui-component/components/Dropdown';
import { getSubmitPath, overrideSelectTheme } from '../utils';
import './QueryForm.css';

/**
 * @param {Object} props
 * @param {string[]} [props.nodeTypes]
 * @param {(value: any, searchParamsString: string) => void} [props.onSearchFormSubmit]
 * @param {string} props.project
 * @param {number} [props.queryNodeCount]
 */
function QueryForm({
  nodeTypes = [],
  onSearchFormSubmit,
  project,
  queryNodeCount = 0,
}) {
  const [searchParams] = useSearchParams();
  const [selectValue, setSelectValue] = useState(
    searchParams.has('node_type')
      ? {
          value: searchParams.get('node_type'),
          label: searchParams.get('node_type'),
        }
      : null
  );

  /** @param {string} fileType */
  function handleDownloadAll(fileType) {
    window.open(
      `${getSubmitPath(project)}/export?node_label=${
        selectValue.value
      }&format=${fileType}`,
      '_blank'
    );
  }

  /** @type {React.FormEventHandler} */
  function handleQuerySubmit(e) {
    e.preventDefault();
    if (onSearchFormSubmit === undefined) return;

    const form = /** @type {HTMLFormElement} */ (e.target);
    const data = { project };
    const queryParam = [];

    for (const input of form) {
      const { name, value } = /** @type {HTMLInputElement} */ (input);
      if (name && value) {
        queryParam.push(`${name}=${value}`);
        data[name] = value;
      }
    }

    onSearchFormSubmit(data, queryParam.join('&'));
  }

  return (
    <form onSubmit={handleQuerySubmit}>
      <Select
        className='query-form__select'
        name='node_type'
        options={nodeTypes
          .filter((nodeType) => !['program', 'project'].includes(nodeType))
          .map((nodeType) => ({ value: nodeType, label: nodeType }))}
        value={selectValue}
        onChange={setSelectValue}
        theme={overrideSelectTheme}
      />
      <input
        className='query-form__input'
        placeholder='submitter_id'
        type='text'
        name='submitter_id'
      />
      <input
        className='query-form__search-button'
        type='submit'
        onSubmit={handleQuerySubmit}
        value='search'
      />
      {selectValue && queryNodeCount > 0 ? (
        <Dropdown className='query-node__download-button'>
          <Dropdown.Button>Download All</Dropdown.Button>
          <Dropdown.Menu>
            <Dropdown.Item
              rightIcon='download'
              onClick={() => handleDownloadAll('tsv')}
            >
              TSV
            </Dropdown.Item>
            <Dropdown.Item
              rightIcon='download'
              onClick={() => handleDownloadAll('json')}
            >
              JSON
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </form>
  );
}

QueryForm.propTypes = {
  nodeTypes: PropTypes.arrayOf(PropTypes.string),
  onSearchFormSubmit: PropTypes.func,
  project: PropTypes.string.isRequired,
  queryNodeCount: PropTypes.number,
};

export default QueryForm;
