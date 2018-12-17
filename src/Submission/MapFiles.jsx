import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import Button from '@gen3/ui-component/dist/components/Button';
import BackLink from '../components/BackLink';
import StickyToolbar from '../components/StickyToolbar';
import CheckBox from '../components/CheckBox';
import StatusReadyIcon from '../img/icons/status_ready.svg';
import calculateFileSize from './utils.js';
import './MapFiles.less';

class MapFiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilesByGroup: {},
      allFilesByGroup: {},
      filesByDate: {},
      isScrolling: false,
    };
  }

  componentDidMount() {
    this.props.fetchUnmappedFiles(this.props.user.username);
    this.onUpdate();
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
      filesByDate: this.sortUnmappedFiles(),
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
    Object.keys(this.state.filesByDate).forEach((key) => {
      const filesToAdd = this.state.filesByDate[key].filter(file => this.isFileReady(file));
      unselectedMap[index] = new Set(filesToAdd);
      selectedMap[index] = new Set();
      index += 1;
    });
    this.setState({ allFilesByGroup: unselectedMap, selectedFilesByGroup: selectedMap });
  }

  sortUnmappedFiles = () => {
    const sortedFiles = {};
    this.props.unmappedFiles.forEach((file) => {
      const fileDate = moment(file.created_date).format('MM/DD/YY');
      if (sortedFiles[fileDate]) {
        sortedFiles[fileDate].push(file);
      } else {
        sortedFiles[fileDate] = [file];
      }
    });
    return sortedFiles;
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

    const params = queryString.parse(window.location.search);
    const message = params && params.message ? params.message : null;

    return (
      <div className='map-files'>
        {
          message ? (
            <div className='map-files__notification-wrapper'>
              <div className='map-files__notification'>
                <p className='map-files__notification-text'>
                  {message}
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
          {
            Object.keys(this.state.filesByDate).map((key, i) => {
              const files = this.state.filesByDate[key];
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
                        <th>Size</th>
                        <th>Uploaded date</th>
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
                              <td>{file.size ? calculateFileSize(file.size) : '0B'}</td>
                              <td>{moment(file.created_date).format('MM/DD/YY, hh:mm:ss a Z')}</td>
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
