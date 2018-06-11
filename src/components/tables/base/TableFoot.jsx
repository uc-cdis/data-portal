import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TableHead from './TableHead';

export const TFoot = styled.tfoot`
  height: 36px;
  line-height: 36px;
  border-top: 2px solid #000000;
  border-bottom: 1px solid #dedede;
`;

export const TCell = styled.td`
  padding: 0.5rem 1rem;
`;

class TableFoot extends Component {
  render() {
    return (
      <TFoot>
        <tr>
          {
            this.props.cols.map((col, i) => (
              this.props.colStyles.length <= i ?
                <TCell key={`col_${col.name}_${i}`}>{col.name}</TCell> :
                <TCell key={`col_${col.name}_${i}`} style={this.props.colStyles[i]}>
                  {col.name}
                </TCell>
            ))
          }
        </tr>
      </TFoot>
    );
  }
}

TableFoot.propTypes = {
  cols: PropTypes.array.isRequired,
  colStyles: PropTypes.array,
};

TableFoot.defaultProps = {
  colStyles: [],
};

export default TableFoot;
