import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CountBoxTitle = styled.div`
  .align-left & {
    margin-bottom: 15px;
    vertical-align: top;
  }
  .align-center & {
    line-height: 100%;
    margin-bottom: 11px;
  }
`;

const CountBoxNumber = styled.div`
  .align-left & {
    position: absolute;
    bottom: 20px;
  }
`;

const CountBoxWrapper = styled.div`
  &:first-child {
    margin-left: 0px;
  }

  &.align-center { 
    width: 100%;
    height: 100%;
    display: flex;
    margin-left: 0
    padding: 0,
    backgroundColor: none;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  &.align-left {
    position: relative;
    width: 180px;
    height: 120px;
    padding: 20px;
    margin-left: 15px;
    background-color: #ffffff;
    display: inline-block;
  }
`;

class CountBox extends Component {
  render() {
    return (
      <CountBoxWrapper className={`align-${this.props.align}`}>
        <CountBoxTitle className="h4-typo">
          {this.props.label}
        </CountBoxTitle>
        <CountBoxNumber className="special-number">
          {Number(this.props.value).toLocaleString()}
        </CountBoxNumber>
      </CountBoxWrapper>
    );
  }
}

CountBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  align: PropTypes.string,
};

CountBox.defaultProps = {
  align: 'left',
};

export default CountBox;
