import React from 'react';
import PropTypes from 'prop-types';
import './TooltipCDIS.less';

class TooltipCDIS extends React.Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      const txts = label.split('#');
      const number = parseInt(txts[0], 10);
      return (
        <div className='cdis-tooltip'>
          <h2>{`${txts[1]}`}</h2>
          {
            payload.map(
              item => <div key={item.name} style={{ color: `${item.fill}` }} className='body-typo'>{`${item.name} : ${Math.round((item.value / 100) * number)}`}</div>,
            )
          }
        </div>
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
