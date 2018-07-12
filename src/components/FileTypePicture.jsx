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

class FileTypePicture extends Component {
    render() {
      return (
          <WhiteContainer>
            <CenteredPicture>
              <IconComponent dictIcons={this.props.dictIcons} iconName="zip" height="100%" />
            </CenteredPicture>
          </WhiteContainer>
      );
    }
}

FileTypePicture.propTypes = {
  data_format: PropTypes.string.isRequired,
  dictIcons: PropTypes.object.isRequired,
};

export default FileTypePicture;
