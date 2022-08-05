import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import CheckBox from '../components/CheckBox';
import StatusReadyIcon from '../img/icons/status_ready.svg';
import { humanFileSize } from '../utils.js';
import './MapFiles.css';

const HEADER_HEIGHT = 70;
const ROW_HEIGHT = 70;

dayjs.extend(customParseFormat);

/**
 * @param {Object} props
 * @param {Array} props.files
 * @param {number} props.groupIndex
 * @param {(rowIndex: number) => void} props.onToggleCheckbox
 * @param {() => void} props.onToggleSelectAll
 * @param {{ all: boolean; files: boolean[] }} props.selectStatus
 */
function MapFilesTable({
  files,
  groupIndex,
  onToggleCheckbox,
  onToggleSelectAll,
  selectStatus,
}) {
  const title = `Uploaded on ${dayjs(files[0].created_date).format(
    'MM/DD/YY'
  )}, ${files.length} ${files.length > 1 ? 'files' : 'file'}`;

  return (
    <>
      <div className='h2-typo'>{title}</div>
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            className='map-files__table'
            width={width}
            height={Math.min(500, files.length * ROW_HEIGHT + HEADER_HEIGHT)}
            headerHeight={ROW_HEIGHT}
            rowHeight={ROW_HEIGHT}
            rowCount={files.length}
            rowGetter={({ index }) => files[index]}
            rowClassName='map-files__table-row'
          >
            <Column
              width={100}
              label='Select All'
              dataKey='selectAll'
              headerRenderer={() => (
                <CheckBox
                  id={`${groupIndex}`}
                  isSelected={selectStatus.all}
                  onChange={onToggleSelectAll}
                />
              )}
              cellRenderer={({ rowIndex }) => (
                <CheckBox
                  id={`${files[rowIndex].did}`}
                  item={files[rowIndex]}
                  isSelected={selectStatus.files[rowIndex]}
                  onChange={() => onToggleCheckbox(rowIndex)}
                  isEnabled={files[rowIndex].status === 'Ready'}
                  disabledText={'This file is not ready to be mapped yet.'}
                />
              )}
            />
            <Column label='File Name' dataKey='file_name' width={400} />
            <Column
              label='Size'
              dataKey='size'
              width={100}
              cellRenderer={({ cellData }) => (
                <div>{cellData ? humanFileSize(cellData) : '0 B'}</div>
              )}
            />
            <Column
              label='Uploaded Date'
              dataKey='created_date'
              width={300}
              cellRenderer={({ cellData }) => (
                <div>
                  {dayjs(cellData).format('MM/DD/YY, hh:mm:ss a [UTC]Z')}
                </div>
              )}
            />
            <Column
              label='Status'
              dataKey='status'
              width={400}
              cellRenderer={({ cellData }) => {
                const className = `map-files__status--${cellData.toLowerCase()}`;
                return (
                  <div className={className}>
                    {cellData === 'Ready' ? <StatusReadyIcon /> : null}
                    <div className='h2-typo'>
                      {cellData === 'Ready' ? cellData : `${cellData}...`}
                    </div>
                  </div>
                );
              }}
            />
          </Table>
        )}
      </AutoSizer>
    </>
  );
}

MapFilesTable.propTypes = {
  files: PropTypes.array,
  groupIndex: PropTypes.number,
  onToggleCheckbox: PropTypes.func,
  onToggleSelectAll: PropTypes.func,
  selectStatus: PropTypes.shape({
    all: PropTypes.bool,
    files: PropTypes.arrayOf(PropTypes.bool),
  }),
};

export default MapFilesTable;
