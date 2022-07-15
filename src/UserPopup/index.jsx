import { useMemo, useState } from 'react';
import SimplePopup from '../components/SimplePopup';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchIndexPageCounts } from '../redux/index/asyncThunks';
import { receiveUser } from '../redux/user/slice';
import { fetchUser } from '../redux/user/asyncThunks';
import { fetchUserAccess } from '../redux/userAccess/asyncThunks';
import { headers, userapiPath } from '../localconf';
import RegistrationForm from './RegistrationForm';
import ReviewForm from './ReviewForm';
import './UserPopup.css';

/** @typedef {import('../redux/types').AppDispatch} AppDispatch */
/** @typedef {{ [id: number]: boolean }} UserReviewStatus */

/** @param {{ firstName: string; lastName: string; institution: string }} userInformation */
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

/** @param {import('../redux/types').RootState} state */
function userPopupSelector({ user }) {
  const isRegistered = user.authz?.['/portal']?.length > 0;
  const docsToBeReviewed = (user.docs_to_be_reviewed ?? []).filter(
    (doc) => doc.required
  );
  return {
    docsToBeReviewed,
    shouldRegister: !isRegistered,
    shouldReview: isRegistered && docsToBeReviewed.length > 0,
  };
}

function UserPopup() {
  const { docsToBeReviewed, shouldRegister, shouldReview } =
    useAppSelector(userPopupSelector);
  const popupType = useMemo(() => {
    if (shouldRegister) return 'register';
    if (shouldReview) return 'review';
    return undefined;
  }, []);

  const [show, setShow] = useState(shouldRegister || shouldReview);
  function handleClose() {
    setShow(false);
  }

  const dispatch = useAppDispatch();
  async function handleRegister(
    /** @type {import('./types').UserRegistrationInput} */ userInput
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

      /** @type {import('../redux/user/types').User} */
      const user = await userResponse.json();
      if (user.authz['/portal'] === undefined)
        throw new Error('Failed to update authorization information.');

      dispatch(receiveUser(user));
      /** @type {AppDispatch} */ (dispatch)(fetchUserAccess());
      /** @type {AppDispatch} */ (dispatch)(fetchIndexPageCounts());
      return 'success';
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      return 'error';
    }
  }

  function handleReview(/** @type {UserReviewStatus} */ reviewStatus) {
    return updateDocsToReview(reviewStatus).then(({ ok }) => {
      if (!ok) throw Error('Failed to update reviewed documents.');

      /** @type {AppDispatch} */ (dispatch)(fetchUser());
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
