import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TableRow from './TableRow';
import TableFoot from './TableFoot';
import TableHead from './TableHead';

export const Tb = styled.table`
  border-collapse: collapse;
  overflow: auto;
  margin: 1em 0em;
  text-align:center;
  width:100%;
`;

class Table extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */
  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <Tb>
          <TableHead cols={this.props.header} colStyles={this.props.colStyles} />
          {
            this.props.footer.length > 0 &&
            <TableFoot cols={this.props.footer} colStyles={this.props.colStyles} />
          }
          <tbody>
            {
              this.props.data.map((datum, i) => (<TableRow
                key={`${this.props.title}_${i}`}
                cols={datum}
                idx={i}
                colStyles={this.props.colStyles}
              />))
            }
          </tbody>
        </Tb>
      </div>
    );
  }
}

Table.propTypes = {
  title: PropTypes.string,
  header: PropTypes.array,
  data: PropTypes.array,
  footer: PropTypes.array,
  colStyles: PropTypes.array,
};

Table.defaultProps = {
  title: '',
  header: [],
  data: [],
  footer: [],
  colStyles: [],
};

export default Table;
