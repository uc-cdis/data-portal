import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PropTypes from 'prop-types';
import CheckBox from '../components/CheckBox';
import StatusReadyIcon from '../img/icons/status_ready.svg';
import { humanFileSize } from '../utils.js';
import './MapFiles.css';

dayjs.extend(customParseFormat);

/**
 * @param {Object} props
 * @param {(import('./types').SubmissionFile & { status: boolean })[]} props.files
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
  const headers = ['File Name', 'Size', 'Uploaded Date', 'Status'];
  const rows = files.map((file) => [
    file.file_name,
    file.size ? humanFileSize(file.size) : '0 B',
    dayjs(file.created_date).format('MM/DD/YY, hh:mm:ss a [UTC]Z'),
    <div
      className={`map-files__status--${file.status ? 'ready' : 'generating'}`}
    >
      {file.status ? <StatusReadyIcon /> : null}
      <div className='h2-typo'>{file.status ? 'Ready' : 'generating...'}</div>
    </div>,
  ]);

  return (
    <div className='map-files__table'>
      <div className='h2-typo'>{title}</div>
      <table className='map-files__table'>
        <thead>
          <tr className='map-files__table-row'>
            <th scope='col' className='map-files__table-checkbox'>
              <CheckBox
                id={`${groupIndex}`}
                isSelected={selectStatus.all}
                onChange={onToggleSelectAll}
              />
            </th>
            {headers.map((header) => (
              <th scope='col'>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cols, index) => (
            <tr className='map-files__table-row'>
              <th scope='row' className='map-files__table-checkbox'>
                <CheckBox
                  id={`${files[index].did}`}
                  item={files[index]}
                  isSelected={selectStatus.files[index]}
                  onChange={() => onToggleCheckbox(index)}
                  isEnabled={files[index].status}
                  disabledText={'This file is not ready to be mapped yet.'}
                />
              </th>
              {cols.map((col) => (
                <td>{col}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
