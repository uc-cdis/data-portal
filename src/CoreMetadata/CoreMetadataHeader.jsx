import PropTypes from 'prop-types';
import copy from 'clipboard-plus';
import Button from '../gen3-ui-component/components/Button';
import Popup from '../components/Popup';
import { userapiPath } from '../localconf';
import isEnabled from '../helpers/featureFlags';

const DOWNLOAD_BTN_CAPTION = 'Download';
const SIGNED_URL_BTN_CAPTION = 'Generate Signed URL';
const SIGNED_URL_MSG =
  'Please copy your signed URL below (this generated signed URL will expire in an hour):';
const SIGNED_URL_ERROR_MSG =
  'An error has occurred when generating signed URL:';

/**
 * @typedef {Object} CoreMetadata
 * @property {string} data_format
 * @property {string} file_name
 * @property {number} file_size
 * @property {string} description
 * @property {string} updated_datetime
 * @property {string} object_id
 * @property {string} type
 */

/**
 * @param {Object} props
 * @param {CoreMetadata} props.metadata
 * @param {string} props.signedURL
 * @param {boolean} props.signedURLPopup
 * @param {string} props.error
 * @param {(object_id: string) => void} props.onGenerateSignedURL
 * @param {({ singedURLPopup: boolean }) => void} props.onUpdatePopup
 * @param {() => void} props.onClearSignedURL
 */
function CoreMetadataHeader({
  metadata,
  signedURL,
  error,
  signedURLPopup,
  onGenerateSignedURL,
  onUpdatePopup,
  onClearSignedURL,
}) {
  if (!metadata) return <p className='body-typo'>Error: {error}</p>;

  if (!metadata.data_format)
    /* eslint no-console: ["error", { allow: ["error"] }] */
    console.error(
      "WARNING: null value found for mandatory field 'data_format', please verify the correctness of metadata"
    );

  function onSignedURLPopupClose() {
    onUpdatePopup({ signedURLPopup: false });
    onClearSignedURL();
  }

  const fileTypeToDisplay = metadata.type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const fileSizeOrder =
    metadata.file_size === 0
      ? 0
      : Math.floor(Math.log(metadata.file_size) / Math.log(1024));
  const fileSizeStr =
    (metadata.file_size / 1024 ** fileSizeOrder).toFixed(2) * 1;
  const fileSizeUnit = ['B', 'KB', 'MB', 'GB', 'TB'][fileSizeOrder];
  const fileSizeToDisplay = `${fileSizeStr} ${fileSizeUnit}`;

  return (
    <div className='body-typo'>
      <p className='h3-typo'>
        {metadata.file_name}
        <br />
        {`| ${fileTypeToDisplay} |`}
      </p>
      <p className='body-typo'>{metadata.description}</p>
      <a
        href={`${userapiPath}/data/download/${metadata.object_id}?expires_in=900&redirect`}
      >
        <button className='button-primary-orange' type='button'>
          {DOWNLOAD_BTN_CAPTION}
        </button>
      </a>
      {isEnabled('signedURLButton') && (
        <Button
          onClick={() => onGenerateSignedURL(metadata.object_id)}
          label={SIGNED_URL_BTN_CAPTION}
          className='core-metadata-page__column--right--signed-url-button'
          buttonType='primary'
        />
      )}
      {signedURLPopup && (
        <Popup
          message={error ? SIGNED_URL_ERROR_MSG : SIGNED_URL_MSG}
          error={error}
          lines={error ? [] : [{ code: signedURL }]}
          title='Generated Signed URL'
          leftButtons={[
            {
              caption: 'Close',
              fn: onSignedURLPopupClose,
            },
          ]}
          rightButtons={[
            {
              caption: 'Copy',
              fn: () => copy(signedURL),
              icon: 'copy',
              enabled: !error,
            },
          ]}
          onClose={onSignedURLPopupClose}
        />
      )}
      <div className='body-typo'>{`${
        metadata.data_format
      } | ${fileSizeToDisplay} | ${
        metadata.object_id
      } | Updated on ${metadata.updated_datetime.substr(0, 10)}`}</div>
    </div>
  );
}

CoreMetadataHeader.propTypes = {
  metadata: PropTypes.object,
  signedURL: PropTypes.string,
  signedURLPopup: PropTypes.bool,
  error: PropTypes.string,
  onGenerateSignedURL: PropTypes.func.isRequired,
  onUpdatePopup: PropTypes.func.isRequired,
  onClearSignedURL: PropTypes.func.isRequired,
};

CoreMetadataHeader.defaultProps = {
  metadata: null,
  signedURL: null,
  signedURLPopup: false,
  error: null,
};

export default CoreMetadataHeader;
