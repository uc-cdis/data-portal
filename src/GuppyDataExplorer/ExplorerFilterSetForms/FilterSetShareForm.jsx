import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Button from '../../gen3-ui-component/components/Button';
import './ExplorerFilterSetForms.css';

function useToken(fetcher) {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);

  function refresh() {
    setData(null);
    setIsError(false);

    fetcher()
      .then(setData)
      .catch(() => setIsError(true));
  }
  useEffect(refresh, []);

  return {
    data,
    isError,
    refresh,
  };
}

/**
 * @param {Object} prop
 * @param {() => Promise<string>} prop.onAction
 * @param {() => void} prop.onClose
 */
function FilterSetShareForm({ onAction, onClose }) {
  const token = useToken(onAction);
  const [isTokenCopied, setIsTokenCopied] = useState(false);
  function toggleIsTokenCopied() {
    setIsTokenCopied(true);
    setTimeout(() => setIsTokenCopied(false), 2000);
  }
  function handleCopy() {
    navigator.clipboard.writeText(token.data).then(toggleIsTokenCopied);
  }

  return (
    <div className='explorer-filter-set-form'>
      <h4>Use the following token to share your Filter Set</h4>
      <div style={{ margin: '1rem' }}>
        {token.isError ? (
          <p>Failed to generate a shareable token! Please try again.</p>
        ) : (
          <pre>{token.data ?? 'Generating token...'}</pre>
        )}
      </div>

      <div>
        <Button buttonType='default' label='Back to page' onClick={onClose} />
        {token.isError ? (
          <Button
            buttonType='primary'
            label='Try again'
            onClick={token.refresh}
          />
        ) : (
          <Button
            buttonType='secondary'
            label={
              isTokenCopied ? (
                <>
                  Copied <FontAwesomeIcon icon='circle-check' />
                </>
              ) : (
                'Copy to clipboard'
              )
            }
            enabled={token.data !== null && !isTokenCopied}
            onClick={handleCopy}
          />
        )}
      </div>
    </div>
  );
}

FilterSetShareForm.propTypes = {
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

export default FilterSetShareForm;
