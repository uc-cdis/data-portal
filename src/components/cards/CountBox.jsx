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
`;

const CountBoxWrapper = styled.div`
  height: 100%;

  &.align-center { 
    width: 100%;
    display: flex;
    padding: 0,
    backgroundColor: none;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  &.align-left {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
  align: PropTypes.oneOf(['left', 'center']),
};

CountBox.defaultProps = {
  align: 'center',
};

export default CountBox;
