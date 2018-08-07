import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import IconComponent from '../components/Icon';

export const WhiteContainer = styled.div`
  background-color: white;
  border: 1px solid silver;
  border-radius: 10px;
  textAlign: center;
`;

export const CenteredPicture = styled.div`
  display: table;
  margin: 0 auto;
  padding-top: 50px;
  padding-bottom: 50px;
`;

function dataFormatToFileType(dictIcons, dataFormat) {
  const fileTypes = Object.keys(dictIcons); // list of available types
  const format = dataFormat.toLowerCase();
  return format in fileTypes ? format : 'file';
}

class FileTypePicture extends Component {
  render() {
    const dataFormat = this.props.metadata ? this.props.metadata.data_format : 'file';
    const fileType = dataFormatToFileType(this.props.dictIcons, dataFormat);
    if (!fileType) return null;
    const content = (
      <WhiteContainer>
        <CenteredPicture>
          <IconComponent
            dictIcons={this.props.dictIcons}
            iconName={fileType}
            height='100%'
          />
        </CenteredPicture>
      </WhiteContainer>
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
