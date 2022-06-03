import { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contactEmail } from '../localconf';
import Button from '../gen3-ui-component/components/Button';

/** @typedef {import('../types').UserState} UserState */
/** @typedef {{ [id: number]: boolean }} ReviewStatus */

/**
 * @param {Object} props
 * @param {UserState['docs_to_be_reviewed']} props.docsToBeReviewed
 * @param {() => void} props.onClose
 * @param {(reviewStatus: ReviewStatus) => Promise<void>} props.onReview
 */
function ReviewForm({ docsToBeReviewed, onClose, onReview }) {
  const initialReviewStatus = /** @type {ReviewStatus} */ ({});
  for (const { id } of docsToBeReviewed) initialReviewStatus[id] = false;
  const [reviewStatus, setReviewStatus] = useState(initialReviewStatus);

  /** @typedef {'default' | 'error' | 'processing'} FormStatus */
  const [status, setStatus] = useState(/** @type {FormStatus} */ ('default'));
  function handleReview() {
    setStatus('processing');
    onReview(reviewStatus).catch(() => setStatus('error'));
  }

  return (
    <form className='user-popup__form'>
      {status === 'error' ? (
        <div>
          <FontAwesomeIcon
            icon='triangle-exclamation'
            color='var(--g3-color__rose)'
          />
          <h2>Error in your document review...</h2>
          <p>
            Please retry or refreshing the page. If the problem persists, please
            contact the administrator (
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>) for more
            information.
          </p>
        </div>
      ) : (
        <div>
          <p>
            <FontAwesomeIcon
              icon='triangle-exclamation'
              color='var(--pcdc-color__secondary)'
            />
            Please review the following updated documents to
            <br />
            continue your access to PCDC portal.
          </p>
          <div className='user-popup__document-review-group'>
            {docsToBeReviewed.map((doc) => (
              <label key={doc.id}>
                <input
                  type='checkbox'
                  checked={reviewStatus[doc.id]}
                  onChange={(e) => {
                    e.persist();
                    setReviewStatus((prev) => ({
                      ...prev,
                      [doc.id]: e.target.checked,
                    }));
                  }}
                />{' '}
                I have read and agree to the{' '}
                <a href={doc.formatted} target='_blank' rel='noreferrer'>
                  {doc.name}
                </a>{' '}
                (v{doc.version})
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <Button label='Back to page' buttonType='default' onClick={onClose} />
        <Button
          buttonType='primary'
          label={status === 'error' ? 'Retry' : 'Continue'}
          enabled={
            status !== 'processing' &&
            docsToBeReviewed.length > 0 &&
            Object.values(reviewStatus).every(Boolean)
          }
          onClick={handleReview}
        />
      </div>
    </form>
  );
}

ReviewForm.propTypes = {
  docsToBeReviewed: PropTypes.array,
  onClose: PropTypes.func,
  onReview: PropTypes.func,
};

export default ReviewForm;
