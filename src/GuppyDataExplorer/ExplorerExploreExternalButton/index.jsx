import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileSaver from 'file-saver';
import SimplePopup from '../../components/SimplePopup';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import { overrideSelectTheme } from '../../utils';
import { fetchWithCreds } from '../../utils.fetch';
import { getGQLFilter } from '../../GuppyComponents/Utils/queries';
import ExplorerFilterDisplay from '../ExplorerFilterDisplay';
import './ExplorerExploreExternalButton.css';
import Spinner from '../../components/Spinner';

/** @typedef {import('../types').ExplorerFilter} ExplorerFilter */

/** @typedef {import('./types').ExternalCommonsInfo} ExternalCommonsInfo */

/**
 * @param {{ path: string; body: string }} payload
 * @returns {Promise<ExternalCommonsInfo>}
 */
async function fetchExternalCommonsInfo(payload) {
  const res = await fetchWithCreds({ ...payload, method: 'POST' });
  if (res.status !== 200) throw res.response.statusText;
  return res.data;
}

function saveToFile(savingStr, filename) {
  const blob = new Blob([savingStr], { type: 'text/plain' });
  FileSaver.saveAs(blob, filename);
}

/**
 * @param {Object} props
 * @param {ExplorerFilter} props.filter
 */
function ExplorerExploreExternalButton({ filter }) {
  const emptyOption = {
    label: 'Select data commons',
    value: '',
  };
  const externalCommonsOptions = [
    {
      label: 'Genomic Data Commons',
      value: 'gdc',
    },
  ];

  const [selected, setSelected] = useState(emptyOption);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commonsInfo, setCommonsInfo] = useState(
    /** @type {ExternalCommonsInfo} */ (null)
  );
  const [isFileDownloaded, setIsFileDownloaded] = useState(false);

  function openPopup() {
    setShow(true);
  }

  function closePopup() {
    setSelected(emptyOption);
    setCommonsInfo(null);
    setShow(false);
    setIsLoading(false);
    setIsFileDownloaded(false);
  }

  /** @param {typeof selected} newSelected */
  async function handleSelectExternalCommons(newSelected) {
    if (selected.value === newSelected.value) return;
    setSelected(newSelected);

    if (newSelected.value === '') {
      setCommonsInfo(null);
      return;
    }

    try {
      setIsLoading(true);
      const newCommonsInfo = await fetchExternalCommonsInfo({
        path: `/analysis/tools/external/${newSelected.value}`,
        body: JSON.stringify({ filter: getGQLFilter(filter) }),
      });
      setIsLoading(false);
      setCommonsInfo(newCommonsInfo);
    } catch (e) {
      // eslint-disable-next-line no-console
      setIsLoading(false);
      console.error(e);
    }
  }

  function handleOpenExternalCommons() {
    window.open(commonsInfo.link, '_blank');
    closePopup();
  }

  function handleDownloadManifest() {
    const dateString = new Date().toISOString().split('T')[0];
    const filename = `${dateString}-manifest-${selected.value}.txt`;
    saveToFile(commonsInfo.data, filename);
    setIsFileDownloaded(true);
  }

  function isOpenInNewTabButtonEnabled() {
    if (!commonsInfo) {
      return false;
    } else if (commonsInfo.type === 'file') {
      return isFileDownloaded;
    }
  }

  return (
    <>
      <Button
        label={<div>Explore in...</div>}
        rightIcon='external-link'
        buttonType='secondary'
        onClick={openPopup}
      />
      {show && (
        <SimplePopup>
          <div className='explorer-explore-external__form'>
            <h4>Explore in An External Data Commons</h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <SimpleInputField
                label='Data Commons'
                input={
                  <Select
                    inputId='explore-external-data-commons'
                    options={[emptyOption, ...externalCommonsOptions]}
                    value={selected}
                    autoFocus
                    isClearable={false}
                    theme={overrideSelectTheme}
                    onChange={handleSelectExternalCommons}
                  />
                }
              />
              <ExplorerFilterDisplay filter={filter} />
              {isLoading && (
                <div className='explorer-explore-external__loading'>
                  <Spinner />
                </div>
              )}
            </form>
            {commonsInfo?.type === 'file' ? (
              <div className='explorer-explore-external__download-manifest'>
                <p>
                  <FontAwesomeIcon
                    icon='triangle-exclamation'
                    color='var(--pcdc-color__secondary)'
                  />
                  Download a manifest file and upload it to the select commons
                  to use the current cohort.
                </p>
                <Button
                  label='Download manifest'
                  onClick={handleDownloadManifest}
                />
              </div>
            ) : null}
            <div>
              <Button
                className='explorer-explore-external__button'
                buttonType='default'
                label='Back to page'
                onClick={closePopup}
              />
              <Button
                label='Open in new tab'
                enabled={isOpenInNewTabButtonEnabled()}
                onClick={handleOpenExternalCommons}
              />
            </div>
          </div>
        </SimplePopup>
      )}
    </>
  );
}

ExplorerExploreExternalButton.propTypes = {
  filter: PropTypes.object.isRequired,
};

export default ExplorerExploreExternalButton;
