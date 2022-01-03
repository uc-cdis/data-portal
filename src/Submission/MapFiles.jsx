import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
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

function flattenFiles(files) {
  const groupedFiles = Object.keys(files).map((index) => [
    ...Object.values(files[index]),
  ]);
  return groupedFiles.reduce((totalArr, currentArr) =>
    totalArr.concat(currentArr)
  );
}

function createSet(key, values) {
  const set = {};
  for (const value of values) set[value[key]] = value;
  return set;
}

function getSetSize(set) {
  return Object.keys(set).length;
}

function getTableHeaderText(files) {
  const date = dayjs(files[0].created_date).format('MM/DD/YY');
  return `uploaded on ${date}, ${files.length} ${
    files.length > 1 ? 'files' : 'file'
  }`;
}

export function groupUnmappedFiles(unmappedFiles) {
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

export function setMapValue(map, index, value) {
  const tempMap = cloneDeep(map);
  tempMap[index] = value;
  return tempMap;
}

export function addToMap(map, index, file, setKey) {
  const tempMap = cloneDeep(map);
  if (tempMap[index]) tempMap[index][setKey] = file;
  return tempMap;
}

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

export function isSelected({ index, did, selectedFilesByGroup }) {
  return selectedFilesByGroup[index]
    ? !!selectedFilesByGroup[index][did]
    : false;
}

export function isMapEmpty(map) {
  for (const key in map) {
    if (map[key] && getSetSize(map[key]) > 0) return false;
  }
  return true;
}

export function isFileReady(file) {
  return file.hashes && Object.keys(file.hashes).length > 0;
}

class MapFiles extends Component {
  constructor(props) {
    super(props);
    const searchParams = new URLSearchParams(window.location.search);
    this.state = {
      selectedFilesByGroup: {},
      allFilesByGroup: {},
      filesByDate: {},
      isScrolling: false,
      sortedDates: [],
      message: searchParams.get('message'),
      loading: true,
    };
  }

  componentDidMount() {
    this.props.fetchUnmappedFiles(this.props.user.username);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.unmappedFiles !== this.props.unmappedFiles) {
      this.onUpdate();
    }
  }

  onScroll = (isScrolling) => {
    this.setState({ isScrolling });
  };

  onCompletion = () => {
    const flatFiles = flattenFiles(this.state.selectedFilesByGroup);
    this.props.mapSelectedFiles(flatFiles);
    this.props.history.push('/submission/map');
  };

  onUpdate = () => {
    this.setState(
      {
        loading: false,
        ...groupUnmappedFiles(this.props.unmappedFiles),
      },
      () => this.createFileMapByGroup()
    );
  };

  createFileMapByGroup = () => {
    const unselectedMap = {};
    const selectedMap = {};
    let index = 0;
    this.state.sortedDates.forEach((date) => {
      const filesToAdd = this.state.filesByDate[date].filter(isFileReady);
      unselectedMap[index] = createSet(SET_KEY, filesToAdd);
      selectedMap[index] = {};
      index += 1;
    });
    // console.log('createFileMapByGroup', unselectedMap, selectedMap);
    this.setState({
      allFilesByGroup: unselectedMap,
      selectedFilesByGroup: selectedMap,
    });
  };

  toggleCheckBox = (index, file) => {
    console.log('toggleCheckBox');
    if (
      isSelected({
        index,
        did: file.did,
        selectedFilesByGroup: this.state.selectedFilesByGroup,
      })
    ) {
      this.setState((prevState) => ({
        selectedFilesByGroup: removeFromMap(
          prevState.selectedFilesByGroup,
          index,
          file.did
        ),
      }));
    } else if (isFileReady(file)) {
      // file status == ready, so it is selectable
      this.setState((prevState) => ({
        selectedFilesByGroup: addToMap(
          prevState.selectedFilesByGroup,
          index,
          file,
          file.did
        ),
      }));
    }
  };

  toggleSelectAll = (index) => {
    if (this.state.selectedFilesByGroup[index]) {
      if (
        getSetSize(this.state.selectedFilesByGroup[index]) ===
        getSetSize(this.state.allFilesByGroup[index])
      ) {
        this.setState((prevState) => ({
          selectedFilesByGroup: setMapValue(
            prevState.selectedFilesByGroup,
            index,
            {}
          ),
        }));
      } else {
        const newFiles = { ...this.state.allFilesByGroup[index] };
        this.setState((prevState) => ({
          selectedFilesByGroup: setMapValue(
            prevState.selectedFilesByGroup,
            index,
            newFiles
          ),
        }));
      }
    }
  };

  closeMessage = () => {
    this.setState({ message: null });
    window.history.replaceState(null, null, window.location.pathname);
  };

  render() {
    const buttons = [
      <Button
        onClick={this.onCompletion}
        label={
          !isMapEmpty(this.state.selectedFilesByGroup)
            ? `Map Files (${
                flattenFiles(this.state.selectedFilesByGroup).length
              })`
            : 'Map Files'
        }
        rightIcon='graph'
        buttonType='primary'
        className='g3-icon g3-icon--lg'
        enabled={!isMapEmpty(this.state.selectedFilesByGroup)}
      />,
    ];

    const { sortedDates, filesByDate } = this.state;

    return (
      <div className='map-files'>
        {this.state.message ? (
          <div className='map-files__notification-wrapper'>
            <div className='map-files__notification'>
              <CloseIcon
                className='map-files__notification-icon'
                onClick={this.closeMessage}
              />
              <p className='map-files__notification-text'>
                {this.state.message}
              </p>
            </div>
          </div>
        ) : null}
        <BackLink url='/submission' label='Back to Data Submission' />
        <div className='h1-typo'>My Files</div>
        <StickyToolbar
          title='Unmapped Files'
          toolbarElts={buttons}
          scrollPosition={248}
          onScroll={this.onScroll}
        />
        <div
          className={'map-files__tables'.concat(
            this.state.isScrolling ? ' map-files__tables--scrolling' : ''
          )}
        >
          {this.state.loading ? <Spinner /> : null}
          {!this.state.loading && sortedDates.length === 0 ? (
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
                              allFilesByGroup: this.state.allFilesByGroup,
                              selectedFilesByGroup: this.state
                                .selectedFilesByGroup,
                            })}
                            onChange={() => this.toggleSelectAll(groupIndex)}
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
                                selectedFilesByGroup: this.state
                                  .selectedFilesByGroup,
                              })}
                              onChange={() =>
                                this.toggleCheckBox(groupIndex, files[rowIndex])
                              }
                              isEnabled={files[rowIndex].status === 'Ready'}
                              disabledText={
                                'This file is not ready to be mapped yet.'
                              }
                            />
                          );
                        }}
                      />
                      <Column
                        label='File Name'
                        dataKey='file_name'
                        width={400}
                      />
                      <Column
                        label='Size'
                        dataKey='size'
                        width={100}
                        cellRenderer={({ cellData }) => (
                          <div>
                            {cellData ? humanFileSize(cellData) : '0 B'}
                          </div>
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
                              {cellData === 'Ready' ? (
                                <StatusReadyIcon />
                              ) : null}
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
}

MapFiles.propTypes = {
  unmappedFiles: PropTypes.array,
  fetchUnmappedFiles: PropTypes.func.isRequired,
  mapSelectedFiles: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

MapFiles.defaultProps = {
  unmappedFiles: [],
};

export default MapFiles;
