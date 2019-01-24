import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconComponent from '../components/Icon';
import './FileTypePicture.less';

function dataFormatToFileType(dictIcons, dataFormat) {
  const fileTypes = Object.keys(dictIcons); // list of available types
  const format = dataFormat.toLowerCase();
  return fileTypes.includes(format) ? format : 'file';
}

class FileTypePicture extends Component {
  render() {
    const dataFormat = this.props.metadata ? this.props.metadata.data_format : 'file';
    const fileType = dataFormatToFileType(this.props.dictIcons, dataFormat);
    if (!fileType) return null;
    const content = (
      <div className='file-type-picture'>
        <div className='file-type-picture__icon'>
          <IconComponent
            dictIcons={this.props.dictIcons}
            iconName={fileType}
            height='100%'
          />
        </div>
      </div>
    );
    return (content);
  }
}

FileTypePicture.propTypes = {
  metadata: PropTypes.object,
  dictIcons: PropTypes.object.isRequired,
};

FileTypePicture.defaultProps = {
  metadata: null,
};

export default FileTypePicture;
