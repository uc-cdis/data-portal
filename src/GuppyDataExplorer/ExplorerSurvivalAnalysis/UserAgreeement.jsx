import PropTypes from 'prop-types';
import Button from '../../gen3-ui-component/components/Button';

/**
 * @param {Object} props
 * @param {() => void} props.onAgree
 */
function UserAgreement({ onAgree }) {
  return (
    <div className='explorer-survival-analysis__user-agreement'>
      <p>
        In order to use the Survival Analysis analytics tool, you must agree to
        the following:
      </p>
      <ul>
        <li>
          I will not engage in “p-hacking” or other forms of statistical abuse.
        </li>
        <li>
          I will maintain a hypothesis record and declare a hypothesis before
          analyzing data.
        </li>
        <li>
          I will not reproduce or distribute results generated using analytics
          tools.
        </li>
        <li>
          I understand and agree that use of analytics tools is logged and
          monitored to identify abuse and improve the tools. Individual user
          data may be shared with partners of the PCDC (e.g., member consortia)
          for operational purposes. Aggregate or de-identified user data may be
          shared outside of the PCDC without limitation.
        </li>
        <li>
          I understand that access may be revoked if a user is suspected to
          engage in statistical abuse.
        </li>
      </ul>
      <Button buttonType='primary' label='I Agree' onClick={onAgree} />
    </div>
  );
}

UserAgreement.propTypes = {
  onAgree: PropTypes.func,
};

export default UserAgreement;
