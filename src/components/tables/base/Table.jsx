import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import './Table.less';

class Table extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */
  render() {
    return (
      <div className='base-table'>
        <h2>{this.props.title}</h2>
        <table className='base-table__body'>
          <TableHead
            cols={this.props.header}
          />
          {
            this.props.footer.length > 0 &&
            <TableFoot
              cols={this.props.footer}
            />
          }
          <tbody>
            {
              this.props.data.map((datum, i) => (
                <TableRow
                  key={`${this.props.title}_${i}`}
                  cols={datum}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

Table.propTypes = {
  title: PropTypes.string,
  header: PropTypes.array,
  data: PropTypes.array,
  footer: PropTypes.array,
};

Table.defaultProps = {
  title: '',
  header: [],
  data: [],
  footer: [],
};

export default Table;
