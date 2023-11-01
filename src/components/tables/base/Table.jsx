import { useState } from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import innerText from 'react-innertext';
import './Table.css';

export function cellValueToText(value) {
  let text = '';
  if (Array.isArray(value)) {
    text = value.reduce((acc, value, index, array) => {
      if (index < array.length-1) {
        return acc + value + ', '
      } else {
        return acc + value;
      }
    }, '');
  } else if (typeof value === 'object') {
    text = innerText(value);
  } else {
    text = value?.toString?.() ?? '';
  }
  return text;
} 

function Table({ title, header, data, footer }) {
  let [filterArray, setFilters] = useState([]);
  return (
    <div className='base-table'>
      <h2>{title}</h2>
      <table className='base-table__body'>
        <TableHead cols={header} data={data} setFilters={setFilters} />
        {footer.length > 0 && <TableFoot cols={footer} />}
        <tbody>
          {data
            .filter((row) => row.every(
              (value, j) => {
                let text = cellValueToText(value);
                let filterValue = filterArray[j];
                if (typeof filterValue === 'number') {
                  console.log(filterValue)
                }
                return typeof filterValue === 'number' ?
                 (filterValue > 0 &&  value <= filterValue) :
                 text.includes(filterArray[j] ?? '');
              }
            ))
            .map((row, i) => (
              <TableRow key={`${title}_${i}`} cols={row} />
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
