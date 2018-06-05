import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const TRow = styled.tr`
  padding: 0rem 0rem;
  border-bottom: 1px solid #dedede;
  background-color: #ffffff;
  color: #000000;
  height: 60px;
  font-size: 16px;
  ${
  props => (props.oddRow ? 'background-color: #f5f5f5;' : '')
}
`;


export const TCell = styled.td`
  padding: 0.5rem 1rem;
`;

class TableRow extends Component {
  renderCols = cols => cols.map((col, i) => (
    <TCell key={`col_${i}`}>{col}</TCell>
  ));

  render() {
    if (this.props.idx % 2 === 1) {
      return (
        <TRow oddRow>
          {
            this.renderCols(this.props.cols)
          }
        </TRow>
      );
    }
    return (
      <TRow>
        {
          this.renderCols(this.props.cols)
        }
      </TRow>
    );
  }
}

TableRow.propTypes = {
  cols: PropTypes.array.isRequired,
  idx: PropTypes.number.isRequired,
};

export default TableRow;
