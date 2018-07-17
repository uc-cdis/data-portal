import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from './Table';

export const THead = styled.thead`
  height: 36px;
  line-height: 36px;
  border-top: 2px solid #000000;
  border-bottom: 1px solid #dedede;
`;

export const ColHead = styled.th`
  letter-spacing: .02rem;
  color: #000000;
  font-size: 16px;
  font-weight: @semi-bold;
  text-align:center;
`;

class TableHead extends Component {
  render() {
    return (
      <THead>
        <tr>
          {
            this.props.cols.map((col, i) => (
              this.props.colStyles.length <= i ? <ColHead key={`col_${col}_${i}`}>
                {col}
              </ColHead> :
                <ColHead
                  key={`col_${col}_${i}`}
                  style={{ ...this.props.colStyles[i] }}
                >
                  {col}
                </ColHead>
            ))
          }
        </tr>
      </THead>
    );
  }
}

TableHead.propTypes = {
  cols: PropTypes.array.isRequired,
  colStyles: PropTypes.array,
};

TableHead.defaultProps = {
  colStyles: [],
};

export default TableHead;
