import { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import cloneDeep from 'lodash.clonedeep';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Button from '../gen3-ui-component/components/Button';
import BackLink from '../components/BackLink';
import StickyToolbar from '../components/StickyToolbar';
import Spinner from '../components/Spinner';
import CloseIcon from '../img/icons/cross.svg';
import MapFilesTable from './MapFilesTable';
import './MapFiles.css';

const SET_KEY = 'did';

dayjs.extend(customParseFormat);

/** @typedef {import('./types').SubmissionFile} SubmissionFile */
/** @typedef {{ [key: string]: SubmissionFile }} SubmissionFileSet  */
/** @typedef {{ [index: number]: SubmissionFileSet }} SubmissionFileMap */

/** @param {SubmissionFileMap} files */
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
 * @param {SubmissionFile[]} values
 */
function createSet(key, values) {
  const set = /** @type {SubmissionFileSet} */ ({});
  for (const value of values) set[value[key]] = value;
  return set;
}

/** @param {SubmissionFileSet} set */
function getSetSize(set) {
  return Object.keys(set).length;
}

/** @param {SubmissionFile[]} files */
function getTableHeaderText(files) {
  const date = dayjs(files[0].created_date).format('MM/DD/YY');
  return `uploaded on ${date}, ${files.length} ${
    files.length > 1 ? 'files' : 'file'
  }`;
}

/** @param {SubmissionFile[]} unmappedFiles */
export function groupSubmissionFiles(unmappedFiles) {
  /** @type {{ [date: string]: SubmissionFile[] }} */
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
 * @param {SubmissionFileMap} map
 * @param {number} index
 * @param {any} value
 */
export function setMapValue(map, index, value) {
  const tempMap = cloneDeep(map);
  tempMap[index] = value;
  return tempMap;
}

/**
 * @param {SubmissionFileMap} map
 * @param {number} index
 * @param {SubmissionFile} file
 * @param {string} setKey
 */
export function addToMap(map, index, file, setKey) {
  const tempMap = cloneDeep(map);
  if (tempMap[index]) tempMap[index][setKey] = file;
  return tempMap;
}

/**
 * @param {SubmissionFileMap} map
 * @param {number} index
 * @param {string} setKey
 */
export function removeFromMap(map, index, setKey) {
  const tempMap = cloneDeep(map);
  if (tempMap[index]) delete tempMap[index][setKey];
  return tempMap;
}

/**
 * @param {Object} args
 * @param {number} args.index
 * @param {SubmissionFileMap} args.allFilesByGroup
 * @param {SubmissionFileMap} args.selectedFilesByGroup
 */
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
 * @param {SubmissionFileMap} args.selectedFilesByGroup
 */
export function isSelected({ did, index, selectedFilesByGroup }) {
  return selectedFilesByGroup[index]
    ? !!selectedFilesByGroup[index][did]
    : false;
}

/** @param {SubmissionFileMap} map */
export function isMapEmpty(map) {
  for (const key in map) {
    if (map[key] && getSetSize(map[key]) > 0) return false;
  }
  return true;
}

/** @param {SubmissionFile} file */
export function isFileReady(file) {
  return file.hashes && Object.keys(file.hashes).length > 0;
}

/** @type {SubmissionFile[]} */
const defaultUnmapedFiles = [];

/**
 * @param {Object} props
 * @param {(files: SubmissionFile[]) => void} props.mapSelectedFiles
 * @param {SubmissionFile[]} [props.unmappedFiles]
 */
function MapFiles({ mapSelectedFiles, unmappedFiles = defaultUnmapedFiles }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filesByDate, setFilesByDate] = useState({});
  const [sortedDates, setSortedDates] = useState([]);

  const [allFilesByGroup, setAllFilesByGroup] = useState(
    /** @type {SubmissionFileMap} */ ({})
  );
  const [selectedFilesByGroup, setSelectedFilesByGroup] = useState(
    /** @type {SubmissionFileMap} */ ({})
  );

  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);

    const grouped = groupSubmissionFiles(unmappedFiles);
    setFilesByDate(grouped.filesByDate);
    setSortedDates(grouped.sortedDates);

    const unselectedMap = /** @type {SubmissionFileMap} */ ({});
    const selectedMap = /** @type {SubmissionFileMap} */ ({});
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
   * @param {number} index
   * @param {SubmissionFile} file
   */
  function toggleCheckBox(index, file) {
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
          /** @type {SubmissionFile[]} */
          const files = filesByDate[date].map((file) => ({
            ...file,
            status: isFileReady(file) ? 'Ready' : 'generating',
          }));
          const selectStatus = {
            all: isSelectAll({
              index: groupIndex,
              allFilesByGroup,
              selectedFilesByGroup,
            }),
            files: files.map(({ did }) =>
              isSelected({ index: groupIndex, did, selectedFilesByGroup })
            ),
          };

          return (
            <Fragment key={groupIndex}>
              <div className='h2-typo'>{getTableHeaderText(files)}</div>
              <MapFilesTable
                files={files}
                groupIndex={groupIndex}
                onToggleCheckbox={(rowIndex) =>
                  toggleCheckBox(groupIndex, files[rowIndex])
                }
                onToggleSelectAll={() => toggleSelectAll(groupIndex)}
                selectStatus={selectStatus}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

MapFiles.propTypes = {
  mapSelectedFiles: PropTypes.func.isRequired,
  unmappedFiles: PropTypes.array,
};

export default MapFiles;
