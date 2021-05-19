import React from 'react';
import PropTypes from 'prop-types';
import IconicLink from './buttons/IconicLink';
import './Introduction.less';

/**
 * @param {Object} props
 * @param {{ heading:string; text:string; link: string }} props.data
 * @param {{ [iconName: string]: (height: string, svgStyles: Object) => SVGElement }} props.dictIcons
 * @param {boolean} [props.isAdminUser]
 */
function Introduction({ data, dictIcons, isAdminUser }) {
  const buttonText = 'Submit Data';
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
          caption={buttonText}
        />
      )}
    </div>
  );
}

Introduction.propTypes = {
  data: PropTypes.object.isRequired,
  dictIcons: PropTypes.object.isRequired,
  isAdminUser: PropTypes.bool,
};

export default Introduction;
