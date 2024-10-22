import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TableRow, { cellValueToText } from './TableRow';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import './Table.css';

function Table({ title, header, data, footer, filterConfig }) {
  const [filterArray, setFilters] = useState([]);
  const [filteredData, setData] = useState(data);

  useEffect(() => {
    setData(
      data.filter((row) =>
        row.every((value, j) => {
          const text = cellValueToText(value);
          const filterValue = filterArray[j];
          if (!filterValue) {
            return true;
          }
          if (
            typeof filterValue === 'object' &&
            Object.hasOwn(filterValue, 'start')
          ) {
            const valueDate = new Date(value);
            return (
              new Date(`${filterValue.start}T00:00:00.000`) <= valueDate &&
              valueDate <=
                new Date(`${filterValue.end.add({ days: 1 })}T00:00:00.000`)
            );
          }
          if (Array.isArray(filterValue)) {
            if (filterValue.length === 0) {
              return true;
            }
            return filterValue.some(
              (filterString) =>
                value.includes?.(filterString) || text.includes(filterString),
            );
          }
          if (typeof filterValue === 'number') {
            return filterValue > 0 && value <= filterValue;
          }
          return text.includes(filterArray[j]);
        }),
      ),
    );
  }, [filterArray, data]);

  return (
    <div className='base-table'>
      {title ? <h2>{title}</h2> : null}
      <table className='base-table__body'>
        <TableHead
          cols={header}
          data={data}
          setFilters={setFilters}
          filterConfig={filterConfig}
        />
        {footer.length > 0 && <TableFoot cols={footer} />}
        <tbody>
          {filteredData.map((row, i) => (
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
  filterConfig: PropTypes.object,
};

Table.defaultProps = {
  title: '',
  header: [],
  data: [],
  footer: [],
  filterConfig: {},
};

export default Table;
