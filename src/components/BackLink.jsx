import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import dictIcons from '../img/icons/index';
import IconComponent from '../components/Icon';

export const BackComponent = styled.div`
  display: inline;
  padding-right: 15px;
`;

class BackLink extends Component {
  render() {
    return (
      <Link to={this.props.url}>
        <br />
        <BackComponent>
          <IconComponent
            dictIcons={dictIcons}
            iconName="back"
            height="12px"
          />
        </BackComponent>
        <BackComponent>{this.props.label}</BackComponent>
      </Link>
    );
  }
}

BackLink.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default BackLink;
