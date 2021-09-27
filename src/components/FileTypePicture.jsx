import PropTypes from 'prop-types';
import React from 'react';
import IconComponent from './Icon';
import './FileTypePicture.less';

/**
 * @typedef {Object} FileTypePictureProps
 * @property {{ [iconName: string]: (height: string, style: Object) => JSX.Element }} dictIcons
 * @property {Object} [metadata]
 */

/** @param {FileTypePictureProps} props */
function FileTypePicture({ dictIcons, metadata }) {
  const dataFormat = metadata?.data_format.toLowerCase();
  const fileTypes = Object.keys(dictIcons); // list of available types
  const fileType = fileTypes.includes(dataFormat) ? dataFormat : 'file';
  return (
    <div className='file-type-picture'>
      <div className='file-type-picture__icon'>
        <IconComponent
          dictIcons={dictIcons}
          iconName={fileType}
          height='100%'
        />
      </div>
    </div>
  );
}

FileTypePicture.propTypes = {
  dictIcons: PropTypes.objectOf(PropTypes.func).isRequired,
  metadata: PropTypes.object,
};

export default FileTypePicture;
