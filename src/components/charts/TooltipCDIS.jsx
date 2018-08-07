import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'; // see https://github.com/facebook/prop-types#prop-types

const TooltipPopup = styled.div`
  background-color: #ffffff;
  padding: 0px 20px 20px 20px;
`;

class TooltipCDIS extends React.Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      const txts = label.split('#');
      const number = parseInt(txts[0], 10);
      return (
        <TooltipPopup className='custom-tooltip'>
          <h2>{`${txts[1]}`}</h2>
          {
            payload.map(
              item => <div key={item.name} style={{ color: `${item.fill}` }} className='body-typo'>{`${item.name} : ${Math.round((item.value / 100) * number)}`}</div>,
            )
          }
        </TooltipPopup>
      );
    }
    return null;
  }
}


TooltipCDIS.propTypes = {
  label: PropTypes.string,
  payload: PropTypes.array,
  active: PropTypes.bool,
};

TooltipCDIS.defaultProps = {
  label: '',
  payload: [],
  active: false,
};

export default TooltipCDIS;
