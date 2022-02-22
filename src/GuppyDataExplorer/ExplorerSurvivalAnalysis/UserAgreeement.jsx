import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Button from '../../gen3-ui-component/components/Button';

// The following resources are currently works in progress
const statisticalManualHref = '/';
const summaryVideoHref = '/';

const pcdcStatisticalManualLink = (
  <a href={statisticalManualHref} target='_black' rel='noopener noreferrer'>
    PCDC Statistical Manual
    <i className='g3-icon g3-icon--external-link g3-icon--sm g3-icon-color__gray' />
  </a>
);

const checkItems = [
  <>I have read and understand the {pcdcStatisticalManualLink}.</>,
  <>
    I will abide by the principles and policies set forth in the{' '}
    {pcdcStatisticalManualLink}.
  </>,
  'My activity on PCDC web-based analytics tools will be recorded and audited to assess the effectiveness of the pilot and to investigate possible misuse or abuse.',
  'PCDC may contact me to investigate cases of suspected abuse or misuse of web-based analytics tools. I will promptly respond to inquiries regarding my use of the tools.',
  'I will not violate PCDC policies or terms of use.',
  'I will not engage in p-hacking or other forms of statistical misuse.',
  'I will not reproduce or distribute results generated using web-based analytics tools.',
  'I will follow a hypothesis-driven approach when performing analyses and maintain a hypothesis record, which may be audited.',
];

function fullnameSelector(state) {
  const { additional_info: info, username } = state.user;
  return info?.firstName && info?.lastName
    ? `${info?.firstName} ${info?.lastName}`
    : username;
}

/**
 * @param {Object} props
 * @param {() => void} props.onAgree
 */
function UserAgreement({ onAgree }) {
  const fullname = useSelector(fullnameSelector);

  const initalCheckStatus = {};
  for (const i of checkItems.keys()) initalCheckStatus[i] = false;
  const [checkStatus, setCheckstatus] = useState(initalCheckStatus);

  return (
    <div className='explorer-survival-analysis__user-agreement'>
      <p>
        The PCDC has partnered with consortia to pilot web-based analytics
        tools. Due to the potential for statistical misuse and abuse with use of
        the tools, safeguards have been implemented to facilitate responsible
        data exploration.
      </p>
      <p>
        All users of analytics tools are required to review the{' '}
        {pcdcStatisticalManualLink}. The manual outlines principles for
        responsible data exploration and sets forth policies users must agree to
        abide by. A summary video is included below:
      </p>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video controls>
        <source src={summaryVideoHref} type='video/mp4' />
      </video>
      <p>I, {fullname}, agree that:</p>
      <ul>
        {checkItems.map((item, i) => (
          <li>
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
          label='I Agree'
          enabled={Object.values(checkStatus).every(Boolean)}
          onClick={onAgree}
        />
      </div>
    </div>
  );
}

UserAgreement.propTypes = {
  onAgree: PropTypes.func,
};

export default UserAgreement;
