import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import Button from '@gen3/ui-component/dist/components/Button';
import BackLink from '../components/BackLink';
import StickyToolbar from '../components/StickyToolbar';
import CheckBox from '../components/CheckBox';
import Spinner from '../components/Spinner';
import StatusReadyIcon from '../img/icons/status_ready.svg';
import CloseIcon from '../img/icons/cross.svg';
import { humanFileSize } from '../utils.js';
import './MapFiles.less';

const SET_KEY = 'did';
const ROW_HEIGHT = 70;
const HEADER_HEIGHT = 70;

class MapFiles extends React.Component {
  constructor(props) {
    const params = queryString.parse(window.location.search);
    const message = params && params.message ? params.message : null;
    super(props);
    this.state = {
      selectedFilesByGroup: {},
      allFilesByGroup: {},
      filesByDate: {},
      isScrolling: false,
      sortedDates: [],
      message,
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
  }

  onCompletion = () => {
    const flatFiles = this.flattenFiles(this.state.selectedFilesByGroup);
    this.props.mapSelectedFiles(flatFiles);
    this.props.history.push('/submission/map');
  }

  onUpdate = () => {
    this.setState({
      loading: false,
      filesByDate: this.groupUnmappedFiles(),
    }, () => this.createFileMapByGroup());
  }

  getSetSize = set => Object.keys(set).length

  getTableHeaderText = (files) => {
    const date = moment(files[0].created_date).format('MM/DD/YY');
    return `uploaded on ${date}, ${files.length} ${files.length > 1 ? 'files' : 'file'}`;
  }

  setMapValue = (map, index, value) => {
    const tempMap = map;
    tempMap[index] = value;
    return tempMap;
  }

  addToMap = (map, index, file, setKey) => {
    const tempMap = map;
    if (tempMap[index]) {
      tempMap[index][setKey] = file;
    }
    return tempMap;
  }

  removeFromMap = (map, index, setKey) => {
    const tempMap = map;
    if (tempMap[index]) {
      delete tempMap[index][setKey];
    }
    return tempMap;
  }

  createSet = (key, values) => {
    const set = {};
    values.forEach((value) => {
      const setKey = value[key];
      set[setKey] = value;
    });
    return set;
  }

  flattenFiles = (files) => {
    const groupedFiles = Object.keys(files).map(index => [...Object.values(files[index])]);
    return groupedFiles.reduce((totalArr, currentArr) => totalArr.concat(currentArr));
  }

  isSelectAll = (index) => {
    if (this.state.selectedFilesByGroup[index]) {
      return this.getSetSize(this.state.allFilesByGroup[index])
        === this.getSetSize(this.state.selectedFilesByGroup[index])
        && this.getSetSize(this.state.selectedFilesByGroup[index]) > 0;
    }
    return false;
  }

  isSelected = (index, did) => {
    if (this.state.selectedFilesByGroup[index]) {
      return !!this.state.selectedFilesByGroup[index][did];
    }
    return false;
  }

  isMapEmpty = (map) => {
    /* eslint-disable no-restricted-syntax */
    for (const key in map) {
      if (map[key] && this.getSetSize(map[key]) > 0) {
        return false;
      }
    }
    return true;
    /* eslint-enable */
  }

  createFileMapByGroup = () => {
    const unselectedMap = {};
    const selectedMap = {};
    let index = 0;
    this.state.sortedDates.forEach((date) => {
      const filesToAdd = this.state.filesByDate[date].filter(file => this.isFileReady(file));
      unselectedMap[index] = this.createSet(SET_KEY, filesToAdd);
      selectedMap[index] = {};
      index += 1;
    });
    this.setState({ allFilesByGroup: unselectedMap, selectedFilesByGroup: selectedMap });
  }

  groupUnmappedFiles = () => {
    const groupedFiles = {};
    this.props.unmappedFiles.forEach((file) => {
      const fileDate = moment(file.created_date).format('MM/DD/YY');
      if (groupedFiles[fileDate]) {
        groupedFiles[fileDate].push(file);
      } else {
        groupedFiles[fileDate] = [file];
      }
    });
    const sortedDates = Object.keys(groupedFiles).sort((a, b) => moment(b, 'MM/DD/YY') - moment(a, 'MM/DD/YY'));
    this.setState({ sortedDates });
    return groupedFiles;
  }

  toggleCheckBox = (index, file) => {
    if (this.isSelected(index, file.did)) {
      this.setState(prevState => ({
        selectedFilesByGroup: this.removeFromMap(prevState.selectedFilesByGroup, index, file.did),
      }));
    } else if (this.isFileReady(file)) { // file status == ready, so it is selectable
      this.setState(prevState => ({
        selectedFilesByGroup: this.addToMap(prevState.selectedFilesByGroup, index, file, file.did),
      }));
    }
  }

  toggleSelectAll = (index) => {
    if (this.state.selectedFilesByGroup[index]) {
      if (this.getSetSize(this.state.selectedFilesByGroup[index])
        === this.getSetSize(this.state.allFilesByGroup[index])) {
        this.setState(prevState => ({
          selectedFilesByGroup: this.setMapValue(prevState.selectedFilesByGroup, index, {}),
        }));
      } else {
        const newFiles = { ...this.state.allFilesByGroup[index] };
        this.setState(prevState => ({
          selectedFilesByGroup: this.setMapValue(prevState.selectedFilesByGroup, index, newFiles),
        }));
      }
    }
  }

  isFileReady = file => file.hashes && Object.keys(file.hashes).length > 0;

  closeMessage = () => {
    this.setState({ message: null });
    window.history.replaceState(null, null, window.location.pathname);
  }

  render() {
    const buttons = [
      <Button
        onClick={this.onCompletion}
        label={!this.isMapEmpty(this.state.selectedFilesByGroup) ? `Map Files (${this.flattenFiles(this.state.selectedFilesByGroup).length})` : 'Map Files'}
        rightIcon='graph'
        buttonType='primary'
        className='g3-icon g3-icon--lg'
        enabled={!this.isMapEmpty(this.state.selectedFilesByGroup)}
      />,
    ];

    const { sortedDates, filesByDate } = this.state;

    return (
      <div className='map-files'>
        {
          this.state.message ? (
            <div className='map-files__notification-wrapper'>
              <div className='map-files__notification'>
                <CloseIcon className='map-files__notification-icon' onClick={this.closeMessage} />
                <p className='map-files__notification-text'>
                  {this.state.message}
                </p>
              </div>
            </div>
          ) : null
        }
        <BackLink url='/submission' label='Back to Data Submission' />
        <div className='h1-typo'>My Files</div>
        <StickyToolbar
          title='Unmapped Files'
          toolbarElts={buttons}
          scrollPosition={248}
          onScroll={this.onScroll}
        />
        <div className={'map-files__tables'.concat(this.state.isScrolling ? ' map-files__tables--scrolling' : '')}>
          { this.state.loading ? <Spinner /> : null }
          {
            !this.state.loading && sortedDates.length === 0
              ? <h2 className='map-files__empty-text'>No files have been uploaded.</h2>
              : null
          }
          {
            sortedDates.map((date, groupIndex) => {
              const files = filesByDate[date].map(file => ({
                ...file,
                status: this.isFileReady(file) ? 'Ready' : 'generating',
              }));
              const minTableHeight = (files.length * ROW_HEIGHT) + HEADER_HEIGHT;
              return (
                <React.Fragment key={groupIndex}>
                  <div className='h2-typo'>{this.getTableHeaderText(files)}</div>
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
                              isSelected={this.isSelectAll(groupIndex)}
                              onChange={() => this.toggleSelectAll(groupIndex)}
                            />
                          )}
                          cellRenderer={({ rowIndex }) => (
                            <CheckBox
                              id={`${files[rowIndex].did}`}
                              item={files[rowIndex]}
                              isSelected={this.isSelected(groupIndex, files[rowIndex].did)}
                              onChange={() => this.toggleCheckBox(groupIndex, files[rowIndex])}
                              isEnabled={files[rowIndex].status === 'Ready'}
                              disabledText={'This file is not ready to be mapped yet.'}
                            />
                          )}
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
                          cellRenderer={({ cellData }) => <div>{cellData ? humanFileSize(cellData) : '0 B'}</div>}
                        />
                        <Column
                          label='Uploaded Date'
                          dataKey='created_date'
                          width={300}
                          cellRenderer={({ cellData }) => <div>{ moment(cellData).format('MM/DD/YY, hh:mm:ss a [UTC]Z') }</div>}
                        />
                        <Column
                          label='Status'
                          dataKey='status'
                          width={400}
                          cellRenderer={({ cellData }) => {
                            const className = `map-files__status--${cellData.toLowerCase()}`;
                            return (
                              <div className={className}>
                                { cellData === 'Ready' ? <StatusReadyIcon /> : null }
                                <div className='h2-typo'>{ cellData === 'Ready' ? cellData : `${cellData}...`}</div>
                              </div>
                            );
                          }}
                        />
                      </Table>
                    )}
                  </AutoSizer>
                </React.Fragment>
              );
            })
          }
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
