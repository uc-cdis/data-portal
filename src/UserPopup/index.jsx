import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SimplePopup from '../components/SimplePopup';
import { receiveUser } from '../actions';
import { fetchUser, fetchUserAccess } from '../actions.thunk';
import { fetchIndexPageCounts } from '../Index/actions.thunk';
import { headers, userapiPath } from '../localconf';
import RegistrationForm from './RegistrationForm';
import ReviewForm from './ReviewForm';
import './UserPopup.css';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('../types').User} User */
/** @typedef {import('./types').UserRegistrationInput} UserRegistrationInput */

/** @typedef {{ firstName: string; lastName: string; institution: string }} UserInformation */
/** @typedef {{ [id: number]: boolean }} UserReviewStatus */

/** @param {UserInformation} userInformation */
function updateUserInformation(userInformation) {
  return fetch(`${userapiPath}user/`, {
    body: JSON.stringify(userInformation),
    credentials: 'include',
    headers,
    method: 'PUT',
  });
}

/** @param {UserReviewStatus} reviewStatus */
function updateDocsToReview(reviewStatus) {
  return fetch(`${userapiPath}user/documents`, {
    body: JSON.stringify(reviewStatus),
    credentials: 'include',
    headers,
    method: 'POST',
  });
}

const MUST_REVIEW_DOC_TYPE_SET = new Set([
  'acceptable-use-policy',
  'privacy-policy',
  'terms-and-conditions',
]);
/** @param {{ user: import('../types').UserState }} state */
function userPopupSelector({ user }) {
  const isRegistered = user.authz?.['/portal']?.length > 0;
  const docsToBeReviewed = (user.docs_to_be_reviewed ?? []).filter(({ type }) =>
    MUST_REVIEW_DOC_TYPE_SET.has(type)
  );
  return {
    docsToBeReviewed,
    shouldRegister: !isRegistered,
    shouldReview: isRegistered && docsToBeReviewed.length > 0,
  };
}

function UserPopup() {
  const { docsToBeReviewed, shouldRegister, shouldReview } =
    useSelector(userPopupSelector);
  /** @type {'register' | 'review'} */
  const popupType = useMemo(() => {
    if (shouldRegister) return 'register';
    if (shouldReview) return 'review';
    return undefined;
  }, []);

  const [show, setShow] = useState(shouldRegister || shouldReview);
  function handleClose() {
    setShow(false);
  }

  const dispatch = useDispatch();
  async function handleRegister(
    /** @type {UserRegistrationInput} */ userInput
  ) {
    const { reviewStatus, ...userInformation } = userInput;

    try {
      const hasReviewedDocument =
        Object.values(reviewStatus).filter(Boolean).length > 0;
      const documentsResponse = hasReviewedDocument
        ? await updateDocsToReview(reviewStatus)
        : new Response();
      if (!documentsResponse.ok)
        throw new Error('Failed to update document review status.');

      const userResponse = await updateUserInformation(userInformation);
      if (!userResponse.ok)
        throw new Error('Failed to update user information.');

      /** @type {User} */
      const user = await userResponse.json();
      if (user.authz['/portal'] === undefined)
        throw new Error('Failed to update authorization information.');

      dispatch(receiveUser(user));
      /** @type {ThunkDispatch} */ (dispatch)(fetchUserAccess());
      /** @type {ThunkDispatch} */ (dispatch)(fetchIndexPageCounts());
      return 'success';
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      return 'error';
    }
  }

  function handleReview(/** @type {UserReviewStatus} */ reviewStatus) {
    return updateDocsToReview(reviewStatus).then(({ ok }) => {
      if (!ok) throw Error('Failed to update reviewed documents.');

      /** @type {ThunkDispatch} */ (dispatch)(fetchUser());
      handleClose();
    });
  }

  function handleSubscribe() {
    window.open('http://sam.am/PCDCnews', '_blank');
  }

  return (
    show && (
      <SimplePopup>
        {popupType === 'register' && (
          <RegistrationForm
            docsToBeReviewed={docsToBeReviewed}
            onClose={handleClose}
            onRegister={handleRegister}
            onSubscribe={handleSubscribe}
          />
        )}
        {popupType === 'review' && (
          <ReviewForm
            docsToBeReviewed={docsToBeReviewed}
            onClose={handleClose}
            onReview={handleReview}
          />
        )}
      </SimplePopup>
    )
  );
}

export default UserPopup;
