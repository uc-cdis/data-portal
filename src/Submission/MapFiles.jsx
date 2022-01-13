import { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import cloneDeep from 'lodash.clonedeep';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import Button from '../gen3-ui-component/components/Button';
import BackLink from '../components/BackLink';
import StickyToolbar from '../components/StickyToolbar';
import CheckBox from '../components/CheckBox';
import Spinner from '../components/Spinner';
import StatusReadyIcon from '../img/icons/status_ready.svg';
import CloseIcon from '../img/icons/cross.svg';
import { humanFileSize } from '../utils.js';
import './MapFiles.css';

const SET_KEY = 'did';
const ROW_HEIGHT = 70;
const HEADER_HEIGHT = 70;

dayjs.extend(customParseFormat);

/**
 * @typedef {Object} File
 * @property {string} created_date
 * @property {string} did
 * @property {Object} hashes
 */

/** @typedef {{ [key: string]: File }} FileSet  */

/** @typedef {{ [index: number]: FileSet }} FileMap */

/** @param {FileMap} files */
function flattenFiles(files) {
  const groupedFiles = Object.keys(files).map((index) => [
    ...Object.values(files[Number(index)]),
  ]);
  return groupedFiles.reduce((totalArr, currentArr) =>
    totalArr.concat(currentArr)
  );
}

/**
 * @param {string} key
 * @param {File[]} values
 */
function createSet(key, values) {
  const set = /** @type {FileSet} */ ({});
  for (const value of values) set[value[key]] = value;
  return set;
}

/** @param {FileSet} set */
function getSetSize(set) {
  return Object.keys(set).length;
}

/** @param {File[]} files */
function getTableHeaderText(files) {
  const date = dayjs(files[0].created_date).format('MM/DD/YY');
  return `uploaded on ${date}, ${files.length} ${
    files.length > 1 ? 'files' : 'file'
  }`;
}

/** @param {File[]} unmappedFiles */
export function groupUnmappedFiles(unmappedFiles) {
  /** @type {{ [date: string]: File[] }} */
  const filesByDate = {};
  for (const file of unmappedFiles) {
    const fileDate = dayjs(file.created_date).format('MM/DD/YY');
    if (fileDate in filesByDate) filesByDate[fileDate].push(file);
    else filesByDate[fileDate] = [file];
  }
  const sortedDates = Object.keys(filesByDate).sort(
    (a, b) => dayjs(b, 'MM/DD/YY').valueOf() - dayjs(a, 'MM/DD/YY').valueOf()
  );
  return { filesByDate, sortedDates };
}

/**
 * @param {FileMap} map
 * @param {number} index
 * @param {any} value
 */
export function setMapValue(map, index, value) {
  const tempMap = cloneDeep(map);
  tempMap[index] = value;
  return tempMap;
}

/**
 * @param {FileMap} map
 * @param {number} index
 * @param {File} file
 * @param {string} setKey
 */
export function addToMap(map, index, file, setKey) {
  const tempMap = cloneDeep(map);
  if (tempMap[index]) tempMap[index][setKey] = file;
  return tempMap;
}

/**
 * @param {FileMap} map
 * @param {number} index
 * @param {string} setKey
 */
export function removeFromMap(map, index, setKey) {
  const tempMap = cloneDeep(map);
  if (tempMap[index]) delete tempMap[index][setKey];
  return tempMap;
}

export function isSelectAll({ index, allFilesByGroup, selectedFilesByGroup }) {
  return selectedFilesByGroup[index]
    ? getSetSize(allFilesByGroup[index]) ===
        getSetSize(selectedFilesByGroup[index]) &&
        getSetSize(selectedFilesByGroup[index]) > 0
    : false;
}

/**
 * @param {Object} args
 * @param {string} args.did
 * @param {number} args.index
 * @param {FileMap} args.selectedFilesByGroup
 */
export function isSelected({ did, index, selectedFilesByGroup }) {
  return selectedFilesByGroup[index]
    ? !!selectedFilesByGroup[index][did]
    : false;
}

/** @param {FileMap} map */
export function isMapEmpty(map) {
  for (const key in map) {
    if (map[key] && getSetSize(map[key]) > 0) return false;
  }
  return true;
}

/** @param {File} file */
export function isFileReady(file) {
  return file.hashes && Object.keys(file.hashes).length > 0;
}

/**
 * @param {Object} props
 * @param {File[]} props.unmappedFiles
 * @param {(user: { username: string }) => void} props.fetchUnmappedFiles
 * @param {(files: File[]) => void} props.mapSelectedFiles
 * @param {{ username: string }} props.user
 */
function MapFiles({
  unmappedFiles = [],
  fetchUnmappedFiles,
  mapSelectedFiles,
  user: { username },
}) {
  useEffect(() => {
    fetchUnmappedFiles({ username });
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filesByDate, setFilesByDate] = useState({});
  const [sortedDates, setSortedDates] = useState([]);

  const [allFilesByGroup, setAllFilesByGroup] = useState(
    /** @type {FileMap} */ ({})
  );
  const [selectedFilesByGroup, setSelectedFilesByGroup] = useState(
    /** @type {FileMap} */ ({})
  );

  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);

    const grouped = groupUnmappedFiles(unmappedFiles);
    setFilesByDate(grouped.filesByDate);
    setSortedDates(grouped.sortedDates);

    const unselectedMap = /** @type {FileMap} */ ({});
    const selectedMap = /** @type {FileMap} */ ({});
    for (const [index, date] of grouped.sortedDates.entries()) {
      const filesToAdd = grouped.filesByDate[date].filter(isFileReady);
      unselectedMap[index] = createSet(SET_KEY, filesToAdd);
      selectedMap[index] = {};
    }
    setAllFilesByGroup(unselectedMap);
    setSelectedFilesByGroup(selectedMap);
  }, [unmappedFiles]);

  function onCompletion() {
    const flatFiles = flattenFiles(selectedFilesByGroup);
    mapSelectedFiles(flatFiles);
    navigate('/submission/map');
  }

  /**
   *
   * @param {number} index
   * @param {File} file
   */
  function toggleCheckBox(index, file) {
    console.log('toggleCheckBox');
    if (isSelected({ index, did: file.did, selectedFilesByGroup })) {
      setSelectedFilesByGroup((prevSelectedFilesByGroup) =>
        removeFromMap(prevSelectedFilesByGroup, index, file.did)
      );
    } else if (isFileReady(file)) {
      // file status == ready, so it is selectable
      setSelectedFilesByGroup((prevSelectedFilesByGroup) =>
        addToMap(prevSelectedFilesByGroup, index, file, file.did)
      );
    }
  }

  /** @param {number} index */
  function toggleSelectAll(index) {
    if (selectedFilesByGroup[index]) {
      if (
        getSetSize(selectedFilesByGroup[index]) ===
        getSetSize(allFilesByGroup[index])
      ) {
        setSelectedFilesByGroup((prevSelectedFilesByGroup) =>
          setMapValue(prevSelectedFilesByGroup, index, {})
        );
      } else {
        const newFiles = { ...allFilesByGroup[index] };
        setSelectedFilesByGroup((prevSelectedFilesByGroup) =>
          setMapValue(prevSelectedFilesByGroup, index, newFiles)
        );
      }
    }
  }

  function closeMessage() {
    setSearchParams('');
  }
  return (
    <div className='map-files'>
      {searchParams.has('message') ? (
        <div className='map-files__notification-wrapper'>
          <div className='map-files__notification'>
            <CloseIcon
              className='map-files__notification-icon'
              onClick={closeMessage}
            />
            <p className='map-files__notification-text'>
              {searchParams.get('message')}
            </p>
          </div>
        </div>
      ) : null}
      <BackLink url='/submission' label='Back to Data Submission' />
      <div className='h1-typo'>My Files</div>
      <StickyToolbar
        title='Unmapped Files'
        toolbarElts={[
          <Button
            onClick={onCompletion}
            label={
              !isMapEmpty(selectedFilesByGroup)
                ? `Map Files (${flattenFiles(selectedFilesByGroup).length})`
                : 'Map Files'
            }
            rightIcon='graph'
            buttonType='primary'
            className='g3-icon g3-icon--lg'
            enabled={!isMapEmpty(selectedFilesByGroup)}
          />,
        ]}
        scrollPosition={248}
        onScroll={setIsScrolling}
      />
      <div
        className={'map-files__tables'.concat(
          isScrolling ? ' map-files__tables--scrolling' : ''
        )}
      >
        {isLoading ? <Spinner /> : null}
        {!isLoading && sortedDates.length === 0 ? (
          <h2 className='map-files__empty-text'>
            No files have been uploaded.
          </h2>
        ) : null}
        {sortedDates.map((date, groupIndex) => {
          const files = filesByDate[date].map((file) => ({
            ...file,
            status: isFileReady(file) ? 'Ready' : 'generating',
          }));
          const minTableHeight = files.length * ROW_HEIGHT + HEADER_HEIGHT;
          return (
            <Fragment key={groupIndex}>
              <div className='h2-typo'>{getTableHeaderText(files)}</div>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <Table
                    className='map-files__table'
                    width={width}
                    height={minTableHeight < 500 ? minTableHeight : 500}
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
                          isSelected={isSelectAll({
                            index: groupIndex,
                            allFilesByGroup,
                            selectedFilesByGroup,
                          })}
                          onChange={() => toggleSelectAll(groupIndex)}
                        />
                      )}
                      cellRenderer={({ rowIndex }) => {
                        console.log('checkboxId', files[rowIndex].did);
                        return (
                          <CheckBox
                            id={`${files[rowIndex].did}`}
                            item={files[rowIndex]}
                            isSelected={isSelected({
                              index: groupIndex,
                              did: files[rowIndex].did,
                              selectedFilesByGroup,
                            })}
                            onChange={() =>
                              toggleCheckBox(groupIndex, files[rowIndex])
                            }
                            isEnabled={files[rowIndex].status === 'Ready'}
                            disabledText={
                              'This file is not ready to be mapped yet.'
                            }
                          />
                        );
                      }}
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
                          {dayjs(cellData).format(
                            'MM/DD/YY, hh:mm:ss a [UTC]Z'
                          )}
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
                              {cellData === 'Ready'
                                ? cellData
                                : `${cellData}...`}
                            </div>
                          </div>
                        );
                      }}
                    />
                  </Table>
                )}
              </AutoSizer>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

MapFiles.propTypes = {
  unmappedFiles: PropTypes.array,
  fetchUnmappedFiles: PropTypes.func.isRequired,
  mapSelectedFiles: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default MapFiles;
