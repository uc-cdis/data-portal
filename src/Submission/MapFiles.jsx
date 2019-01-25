import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import Button from '@gen3/ui-component/dist/components/Button';
import BackLink from '../components/BackLink';
import StickyToolbar from '../components/StickyToolbar';
import CheckBox from '../components/CheckBox';
import Spinner from '../components/Spinner';
import StatusReadyIcon from '../img/icons/status_ready.svg';
import CloseIcon from '../img/icons/cross.svg';
import { humanFileSize } from '../utils.js';
import './MapFiles.less';

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
    const groupedFiles = Object.values(this.state.selectedFilesByGroup).map(set => Array.from(set));
    const flatFiles = groupedFiles.reduce((totalArr, currentArr) => totalArr.concat(currentArr));
    this.props.mapSelectedFiles(flatFiles);
    this.props.history.push('/submission/map');
  }

  onUpdate = () => {
    this.setState({
      loading: false,
      filesByDate: this.groupUnmappedFiles(),
    }, () => this.createFileMapByGroup());
  }

  getTableHeaderText = (files) => {
    const date = moment(files[0].created_date).format('MM/DD/YY');
    return `uploaded on ${date}, ${files.length} ${files.length > 1 ? 'files' : 'file'}`;
  }

  setMapValue = (map, index, value) => {
    const tempMap = map;
    tempMap[index] = new Set(value);
    return tempMap;
  }

  addToMap = (map, index, file) => {
    const tempMap = map;
    if (tempMap[index]) {
      tempMap[index].add(file);
    }
    return tempMap;
  }

  removeFromMap = (map, index, file) => {
    const tempMap = map;
    if (tempMap[index]) {
      tempMap[index].delete(file);
    }
    return tempMap;
  }

  isSelectAll = (index) => {
    if (this.state.selectedFilesByGroup[index]) {
      return this.state.allFilesByGroup[index].size === this.state.selectedFilesByGroup[index].size
        && this.state.selectedFilesByGroup[index].size > 0;
    }
    return false;
  }

  isSelected = (index, file) => {
    if (this.state.selectedFilesByGroup[index]) {
      return this.state.selectedFilesByGroup[index].has(file);
    }
    return false;
  }

  isMapEmpty = (map) => {
    /* eslint-disable no-restricted-syntax */
    for (const key in map) {
      if (map[key] && map[key].size > 0) {
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
      const filesToAdd = this.state.filesByDate[date]
        .filter(file => this.isFileReady(file));
      unselectedMap[index] = new Set(filesToAdd);
      selectedMap[index] = new Set();
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
    Object.keys(groupedFiles).forEach((fileDate) => {
      const fileList = groupedFiles[fileDate];
      groupedFiles[fileDate] = fileList.sort((file1, file2) => {
        const time1 = (new Date(file1.created_date)).getTime();
        const time2 = (new Date(file2.created_date)).getTime();
        if ((this.isFileReady(file1) && this.isFileReady(file2))
          || (!this.isFileReady(file1) && !this.isFileReady(file2))) {
          return time1 - time2;
        } else if (this.isFileReady(file1)) {
          return -1;
        }
        return 1;
      });
    });
    const sortedDates = Object.keys(groupedFiles).sort((a, b) => moment(b, 'MM/DD/YY') - moment(a, 'MM/DD/YY'));
    this.setState({ sortedDates });
    return groupedFiles;
  }

  toggleCheckBox = (index, file) => {
    if (this.isSelected(index, file)) {
      this.setState({
        selectedFilesByGroup: this.removeFromMap(this.state.selectedFilesByGroup, index, file),
      });
    } else if (this.isFileReady(file)) { // file status == ready, so it is selectable
      this.setState({
        selectedFilesByGroup: this.addToMap(this.state.selectedFilesByGroup, index, file),
      });
    }
  }

  toggleSelectAll = (index) => {
    if (this.state.selectedFilesByGroup[index]) {
      if (this.state.selectedFilesByGroup[index].size === this.state.allFilesByGroup[index].size) {
        this.setState({
          selectedFilesByGroup: this.setMapValue(this.state.selectedFilesByGroup, index, new Set()),
        });
      } else {
        const newFiles = this.state.allFilesByGroup[index];
        this.setState({
          selectedFilesByGroup: this.setMapValue(this.state.selectedFilesByGroup, index, newFiles),
        });
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
        label='Map Files'
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
            sortedDates.map((date, i) => {
              const files = filesByDate[date];
              return (
                <React.Fragment key={i}>
                  <div className='h2-typo'>{this.getTableHeaderText(files)}</div>
                  <table className='map-files__table'>
                    <tbody>
                      <tr className='map-files__table-header'>
                        <th className='map-files__table-checkbox'>
                          <CheckBox
                            id={`${i}`}
                            isSelected={this.isSelectAll(i)}
                            onChange={() => this.toggleSelectAll(i)}
                          />
                        </th>
                        <th>File Name</th>
                        <th style={{ width: '100px' }}>Size</th>
                        <th>Uploaded Date</th>
                        <th>Status</th>
                      </tr>
                      {
                        files.map((file) => {
                          const status = this.isFileReady(file) ? 'Ready' : 'generating';
                          return (
                            <tr key={file.did} className='map-files__table-row'>
                              <td className='map-files__table-checkbox'>
                                <CheckBox
                                  id={file.did}
                                  item={file}
                                  isSelected={this.isSelected(i, file)}
                                  onChange={() => this.toggleCheckBox(i, file)}
                                  isEnabled={status === 'Ready'}
                                  disabledText={'This file is not ready to be mapped yet.'}
                                />
                              </td>
                              <td>{file.file_name}</td>
                              <td>{file.size ? humanFileSize(file.size) : '0 B'}</td>
                              <td>{moment(file.created_date).format('MM/DD/YY, hh:mm:ss a [UTC]Z')}</td>
                              <td className={`map-files__status--${status.toLowerCase()}`}>
                                { status === 'Ready' ? <StatusReadyIcon /> : null }
                                <div className='h2-typo'>{ status === 'Ready' ? status : `${status}...`}</div>
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
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
