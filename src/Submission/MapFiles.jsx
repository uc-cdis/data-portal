import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '@gen3/ui-component/dist/components/Button';
import BackLink from '../components/BackLink';
import StickyToolbar from '../components/StickyToolbar';
import CheckBox from '../components/CheckBox';
import StatusReadyIcon from '../img/icons/status_ready.svg';
import './MapFiles.less';

class MapFiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilesByGroup: {},
      unselectedFilesByGroup: {},
      filesByDate: {},
    };
  }

  componentDidMount() {
    this.props.fetchUnmappedFiles();
    this.onUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.unmappedFiles !== this.props.unmappedFiles) {
      this.onUpdate();
    }
  }

  onCompletion = () => {
    const groupedFiles = Object.values(this.state.selectedFilesByGroup);
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
    tempMap[index] = value;
    return tempMap;
  }

  addToMap = (map, index, file) => {
    const tempMap = map;
    tempMap[index] = tempMap[index].concat(file);
    return tempMap;
  }

  removeFromMap = (map, index, file) => {
    const tempMap = map;
    tempMap[index] = tempMap[index].filter(elt => elt.did !== file.did);
    return tempMap;
  }

  isSelectAll = (index) => {
    if (this.state.unselectedFilesByGroup[index]) {
      return this.state.unselectedFilesByGroup[index].length === 0;
    }
    return false;
  }

  isSelected = (index, file) => {
    if (this.state.selectedFilesByGroup[index]) {
      return this.state.selectedFilesByGroup[index].includes(file);
    }
    return false;
  }

  isMapEmpty = (map) => {
    /* eslint-disable no-restricted-syntax */
    for (const key in map) {
      if (map[key] && map[key].length > 0) {
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
      unselectedMap[index] = this.state.filesByDate[key];
      selectedMap[index] = [];
      index += 1;
    });
    this.setState({ unselectedFilesByGroup: unselectedMap, selectedFilesByGroup: selectedMap });
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
        unselectedFilesByGroup: this.addToMap(this.state.unselectedFilesByGroup, index, file),
      });
    } else if (file.hashes) {
      this.setState({
        selectedFilesByGroup: this.addToMap(this.state.selectedFilesByGroup, index, file),
        unselectedFilesByGroup: this.removeFromMap(this.state.unselectedFilesByGroup, index, file),
      });
    }
  }

  toggleSelectAll = (index) => {
    if (this.state.unselectedFilesByGroup[index].length === 0) {
      this.setState({
        unselectedFilesByGroup:
          this.setMapValue(
            this.state.unselectedFilesByGroup,
            index,
            this.state.selectedFilesByGroup[index],
          ),
        selectedFilesByGroup: this.setMapValue(this.state.selectedFilesByGroup, index, []),
      });
    } else {
      const newFiles = this.state.selectedFilesByGroup[index].concat(
        this.state.unselectedFilesByGroup[index].filter(file => file.hashes !== null),
      );
      this.setState({
        selectedFilesByGroup: this.setMapValue(this.state.selectedFilesByGroup, index, newFiles),
        unselectedFilesByGroup: this.setMapValue(this.state.unselectedFilesByGroup, index, []),
      });
    }
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

    return (
      <div className='map-files'>
        <BackLink url='/submission' label='Back to Data Submission' />
        <div className='h1-typo'>My Files</div>
        <StickyToolbar
          title='Unmapped Files'
          toolbarElts={buttons}
        />
        <div className='map-files__tables'>
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
                          const status = file.hashes ? 'Ready' : 'generating';
                          return (
                            <tr key={file.did} className='map-files__table-row'>
                              <td className='map-files__table-checkbox'>
                                <CheckBox
                                  id={file.did}
                                  item={file}
                                  isSelected={this.isSelected(i, file)}
                                  onChange={() => this.toggleCheckBox(i, file)}
                                />
                              </td>
                              <td>{file.file_name}</td>
                              <td>{file.size}B</td>
                              <td>{moment(file.created_date).format('MM/DD/YY, hh:mm:ss a Z')}</td>
                              <td className={`map-files__status--${status.toLowerCase()}`}>
                                { status === 'Ready' ? <StatusReadyIcon /> : null }
                                <div className='h2-typo'>{status}</div>
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
  history: PropTypes.array.isRequired,
};

MapFiles.defaultProps = {
  unmappedFiles: [],
};

export default MapFiles;
