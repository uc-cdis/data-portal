import { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contactEmail, headers, userapiPath } from '../../localconf';
import ErrorBoundary from '../../components/ErrorBoundary';
import Button from '../../gen3-ui-component/components/Button';
import { useAppSelector } from '../../redux/hooks';

const acceptableUsePolicyLink = (
  <a
    href='https://docs.pedscommons.org/AcceptableUsePolicy/'
    target='_black'
    rel='noopener noreferrer'
  >
    Acceptable Use Policy
    <i className='g3-icon g3-icon--external-link g3-icon--sm g3-icon-color__gray' />
  </a>
);

const pcdcStatisticalManualLink = (
  <a
    href='https://docs.pedscommons.org/StatisticalManual/'
    target='_black'
    rel='noopener noreferrer'
  >
    PCDC Statistical Manual
    <i className='g3-icon g3-icon--external-link g3-icon--sm g3-icon-color__gray' />
  </a>
);

const checkItems = [
  <>
    I have read the {pcdcStatisticalManualLink} and agree to abide by the
    principles and policies set forth in the manual.
  </>,
  'My activity on the PCDC Data Portal will be logged and audited to assess the effectiveness of the pilot and to investigate possible misuse or abuse.',
  'PCDC staff may contact me to investigate cases of suspected abuse or misuse of web-based analytics tools. I will promptly respond to inquiries regarding my use of the tools.',
  <>I will not violate the PCDC Terms of Use or {acceptableUsePolicyLink}.</>,
  'I will not engage in p-hacking or other forms of statistical misuse.',
  'I will not reproduce or distribute results generated using web-based analytics tools.',
  'I will follow a hypothesis-driven approach when performing analyses and maintain a hypothesis record.',
];

/** @param {{ isSubmitting: boolean; onAgree: () => Promise<void> }} props */
function AgreementForm({ isSubmitting, onAgree }) {
  const [error, setError] = useState(/** @type {Error | null} */ (null));
  if (error) throw error;
  function handleAgree() {
    onAgree().catch((err) => {
      console.error(err); // eslint-disable-line no-console
      setError(err);
    });
  }

  const fullname = useAppSelector((state) => {
    const { additional_info: info, username } = state.user;
    return info?.firstName && info?.lastName
      ? `${info?.firstName} ${info?.lastName}`
      : username;
  });

  const initalCheckStatus = {};
  for (const i of checkItems.keys()) initalCheckStatus[i] = false;
  const [checkStatus, setCheckstatus] = useState(initalCheckStatus);

  return (
    <>
      <p>
        The PCDC is piloting a Kaplan-Meier survival analysis tool. Due to the
        potential for statistical misuse and abuse with use of the tool,
        safeguards have been implemented to facilitate responsible data
        exploration.
      </p>
      <p>
        All users of the Kaplan-Meier survival analysis tool are required to
        review the {pcdcStatisticalManualLink}. The manual outlines principles
        for responsible data exploration and sets forth policies users must
        agree to abide by.{' '}
        <a
          href='https://youtu.be/d_x8taJ-lP8'
          target='_black'
          rel='noopener noreferrer'
        >
          Watch this video
          <i className='g3-icon g3-icon--external-link g3-icon--sm g3-icon-color__gray' />
        </a>{' '}
        for a summary of important statistical considerations.
      </p>
      <p>I, {fullname}, agree that:</p>
      <ul>
        {checkItems.map((item, i) => (
          <li key={i}>
            <label>
              <input
                type='checkbox'
                checked={checkStatus[i]}
                onChange={(e) => {
                  e.persist();
                  setCheckstatus((prev) => ({
                    ...prev,
                    [i]: e.target.checked,
                  }));
                }}
              />{' '}
              {item}
            </label>
          </li>
        ))}
      </ul>
      <div className='explorer-survival-analysis__button-group'>
        <Button
          buttonType='primary'
          label='Agree'
          enabled={Object.values(checkStatus).every(Boolean) && !isSubmitting}
          onClick={handleAgree}
        />
      </div>
    </>
  );
}

AgreementForm.propTypes = {
  isSubmitting: PropTypes.bool,
  onAgree: PropTypes.func,
};

/** @param {{ onAgree: () => void }} props */
function ReminderForm({ onAgree }) {
  return (
    <>
      <p>
        You must agree to the following terms, as outlined in the{' '}
        {pcdcStatisticalManualLink} and {acceptableUsePolicyLink}, to proceed:
      </p>
      <ul style={{ listStyleType: 'initial' }}>
        <li>I will not engage in p-hacking.</li>
        <li>I will maintain a hypothesis record.</li>
        <li>I will not reproduce or distribute results without permission.</li>
        <li>My use will be logged and audited.</li>
      </ul>

      <div className='explorer-survival-analysis__button-group'>
        <Button buttonType='primary' label='Continue' onClick={onAgree} />
      </div>
    </>
  );
}

ReminderForm.propTypes = { onAgree: PropTypes.func };

/** @param {{ onAgree: () => void }} props */
function UserAgreement({ onAgree }) {
  const userAgreementDoc = useAppSelector((state) =>
    state.user.docs_to_be_reviewed.find(
      ({ type }) => type === 'survival-user-agreement'
    )
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function submitSurvivalUserAgreement() {
    setIsSubmitting(true);
    return fetch(`${userapiPath}user/documents`, {
      body: JSON.stringify({ [userAgreementDoc?.id]: true }),
      credentials: 'include',
      headers,
      method: 'POST',
    })
      .then(() => onAgree())
      .finally(() => setIsSubmitting(false));
  }

  return (
    <div className='explorer-survival-analysis__user-agreement'>
      {userAgreementDoc !== undefined ? (
        <ErrorBoundary
          fallback={
            <>
              <h2>
                <FontAwesomeIcon
                  icon='triangle-exclamation'
                  color='var(--g3-primary-btn__bg-color)'
                />{' '}
                Error in submitting your response...
              </h2>
              <p>
                Please retry by clicking the {'"Agree"'} button again or
                refreshing the page. If the problem persists, please contact the
                administrator (
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>) for more
                information.
              </p>
              <div className='explorer-survival-analysis__button-group'>
                <Button
                  buttonType='primary'
                  label='Agree'
                  enabled={!isSubmitting}
                  onClick={submitSurvivalUserAgreement}
                />
              </div>
            </>
          }
        >
          <AgreementForm
            isSubmitting={isSubmitting}
            onAgree={submitSurvivalUserAgreement}
          />
        </ErrorBoundary>
      ) : (
        <ReminderForm onAgree={onAgree} />
      )}
    </div>
  );
}

UserAgreement.propTypes = { onAgree: PropTypes.func };

export default UserAgreement;
