import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '../gen3-ui-component/components/Button';
import Gen3ClientSvg from '../img/gen3client.svg';
import MapFilesSvg from '../img/mapfiles.svg';
import { humanFileSize } from '../utils.js';
import './SubmissionHeader.css';

/**
 * @param {Object} props
 * @param {string} props.username
 * @param {(username: string) => void} props.fetchUnmappedFileStats
 * @param {number} [props.unmappedFileCount]
 * @param {number} [props.unmappedFileSize]
 */
function SubmissionHeader({
  username,
  fetchUnmappedFileStats,
  unmappedFileCount = 0,
  unmappedFileSize = 0,
}) {
  useEffect(() => {
    fetchUnmappedFileStats(username);
  }, []);

  function openGen3DataClient() {
    window.open(
      'https://github.com/uc-cdis/cdis-data-client/releases',
      '_blank'
    );
  }

  function openGen3Tutorials() {
    window.open('https://gen3.org/resources/user/gen3-client/', '_blank');
  }

  const history = useHistory();
  const location = useLocation();
  function navigateToMyFiles() {
    history.push(`${location.pathname}/files`);
  }

  return (
    <div className='submission-header'>
      <div className='submission-header__section'>
        <div className='submission-header__section-image'>
          <div className='submission-header__section-image--clear' />
          <Gen3ClientSvg />
          <Button
            onClick={openGen3Tutorials}
            className='submission-header__section-button'
            label='Read Tutorials'
            buttonType='default'
            enabled
          />
        </div>
        <div className='submission-header__section-info'>
          <div className='h3-typo'>Gen3 Client</div>
          <div className='h4-typo'>Powerful Uploading for Large Files</div>
          <div className='body-typo'>
            Upload your large files quickly and safely without interruptions.
          </div>
          <Button
            onClick={openGen3DataClient}
            className='submission-header__section-button'
            label='Download App'
            rightIcon='download'
            buttonType='default'
            enabled
          />
        </div>
      </div>
      <div className='submission-header__section'>
        <div className='submission-header__section-image'>
          <MapFilesSvg />
        </div>
        <div className='submission-header__section-info'>
          <div className='h3-typo'>Map My Files</div>
          <div className='h4-typo'>
            {unmappedFileCount} files | {humanFileSize(unmappedFileSize)}
          </div>
          <div className='body-typo'>
            Mapping files to metadata in order to create medical meaning.
          </div>
          <Button
            onClick={navigateToMyFiles}
            className='submission-header__section-button'
            label='Map My Files'
            buttonType='primary'
            enabled
          />
        </div>
      </div>
    </div>
  );
}

SubmissionHeader.propTypes = {
  username: PropTypes.string.isRequired,
  fetchUnmappedFileStats: PropTypes.func.isRequired,
  unmappedFileSize: PropTypes.number,
  unmappedFileCount: PropTypes.number,
};

export default SubmissionHeader;
