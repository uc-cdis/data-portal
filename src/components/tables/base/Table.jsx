import PropTypes from 'prop-types';
import TableRow from './TableRow';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import './Table.less';

function Table({ title, header, data, footer }) {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */
  return (
    <div className='base-table'>
      <h2>{title}</h2>
      <table className='base-table__body'>
        <TableHead cols={header} />
        {footer.length > 0 && <TableFoot cols={footer} />}
        <tbody>
          {data.map((datum, i) => (
            <TableRow key={`${title}_${i}`} cols={datum} />
          ))}
        </tbody>
      </table>
    </div>
  );
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
