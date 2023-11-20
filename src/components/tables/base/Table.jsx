import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import innerText from 'react-innertext';
import './Table.css';

export function cellValueToText(value) {
  let text = '';
  if (value instanceof Date) {
    text = value.toLocaleDateString();
  } else if (Array.isArray(value)) {
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
  let [filteredData, setData] = useState(data);

  useEffect(() => {
    setData(data.filter(
      (row) => row.every((value, j) => {
        let text = cellValueToText(value);
        let filterValue = filterArray[j];
        if (!filterValue) {
          return true;
        } else if (typeof filterValue === 'object' && Object.hasOwn(filterValue, 'start')) {
          let valueDate = new Date(value);        
          return new Date(`${filterValue.start}T00:00:00.000`) <= valueDate && 
            valueDate <= new Date(`${filterValue.end.add({days:1})}T00:00:00.000`);
        } else if (Array.isArray(filterValue)) {
          return filterValue.every((filterString) => {
            return value.includes(filterString) || text.includes(filterString);
          });
        } else if (typeof filterValue === 'number') {
          return filterValue > 0 &&  value <= filterValue;
        } else {
          return text.includes(filterArray[j]);
        }
      }
    )));
  }, [filterArray]);

  return (
    <div className='base-table'>
      <h2>{title}</h2>
      <table className='base-table__body'>
        <TableHead cols={header} data={data} setFilters={setFilters} />
        {footer.length > 0 && <TableFoot cols={footer} />}
        <tbody>
          {filteredData
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
