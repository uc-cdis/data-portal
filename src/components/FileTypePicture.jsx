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

function dataFormatToFileType(data_format) {
  const file_types = ['csv', 'tar', 'png', 'txt', 'zip', 'raw', 'tsv'];
  if (!(data_format.toLowerCase() in file_types))
    return undefined;
  return data_format.toLowerCase();
}

class FileTypePicture extends Component {
    render() {
      let file_type = dataFormatToFileType(this.props.data_format);
      if (!file_type)
        return null;
      let content = (
        <WhiteContainer>
          <CenteredPicture>
            <IconComponent
              dictIcons={this.props.dictIcons}
              iconName={file_type}
              height="100%"
            />
          </CenteredPicture>
        </WhiteContainer>
      );
      return (content);
    }
}

FileTypePicture.propTypes = {
  data_format: PropTypes.string.isRequired,
  dictIcons: PropTypes.object.isRequired,
};

export default FileTypePicture;
