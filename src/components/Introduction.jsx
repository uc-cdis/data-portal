import React from 'react';
import PropTypes from 'prop-types';
import IconicLink from './buttons/IconicLink';
import './Introduction.less';

/**
 * @typedef {Object} IntroductionProps
 * @property {{ heading: string; text: string; link: string }} data
 * @property {{ [iconName: string]: (height: string, style: Object) => JSX.Element }} dictIcons
 * @property {boolean} [isAdminUser]
 */

/** @param {Object} IntroductionProps */
function Introduction({ data, dictIcons, isAdminUser }) {
  return (
    <div className='introduction'>
      <div className='h1-typo introduction__title'>{data.heading}</div>
      <div className='high-light introduction__text'>{data.text}</div>
      {isAdminUser && (
        <IconicLink
          link={data.link}
          dictIcons={dictIcons}
          className='introduction__icon'
          icon='upload'
          iconColor='#'
          caption='Submit Data'
        />
      )}
    </div>
  );
}

Introduction.propTypes = {
  data: PropTypes.exact({
    heading: PropTypes.string,
    text: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  dictIcons: PropTypes.objectOf(PropTypes.func).isRequired,
  isAdminUser: PropTypes.bool,
};

export default Introduction;
