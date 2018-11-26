import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import BackLink from '../components/BackLink';
import StickyToolbar from '../components/StickyToolbar';
import CheckBox from '../components/CheckBox';
import './MapFiles.less';

class MapFiles extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        selectedFileIdsByGroup: {},
        unselectedFileIdsByGroup: {},
        filesByDate: {},
      };
  }

  componentDidMount() {
    this.props.fetchUnmappedFiles();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.unmappedFiles !== this.props.unmappedFiles) {
      this.onUpdate();
    }
  }

  createFileMapByGroup = () => {
    let unselectedMap = {};
    let selectedMap = {};
    let index = 0;
    Object.keys(this.state.filesByDate).forEach(key => {
      unselectedMap[index] = this.state.filesByDate[key].map(arr => arr.did);
      selectedMap[index] = [];
      index += 1
    })
    this.setState({ unselectedFileIdsByGroup: unselectedMap, selectedFileIdsByGroup: selectedMap })
  }

  getTableHeaderText = files => {
    let date = moment(files[0].created_date).format('MM/DD/YY')
    return `uploaded on ${date}, ${files.length} ${files.length > 1 ? 'files' : 'file'}`
  }

  isSelected = (index, did) => {
    if (this.state.selectedFileIdsByGroup[index]) {
      return this.state.selectedFileIdsByGroup[index].includes(did);
    }
    return false;
  }

  isSelectAll = index => {
    if (this.state.unselectedFileIdsByGroup[index]) {
      return this.state.unselectedFileIdsByGroup[index].length == 0;
    }
    return false;
  }

  onUpdate = () => {
    this.setState({
      filesByDate: this.sortUnmappedFiles()
    }, () => this.createFileMapByGroup());
  }

  addToMap = (map, index, did) => {
    let tempMap = map;
    tempMap[index] = tempMap[index].concat(did);
    return tempMap;
  }

  removeFromMap = (map, index, did) => {
    let tempMap = map;
    tempMap[index] = tempMap[index].filter(id => id !== did);
    return tempMap;
  }

  setMapValue = (map, index, value) => {
    let tempMap = map;
    tempMap[index] = value;
    return tempMap;
  }

  sortUnmappedFiles = () => {
    let sortedFiles = {};
    this.props.unmappedFiles.map(file => {
      let fileDate = moment(file.created_date).format('MM/DD/YY');
      if (sortedFiles[fileDate]) {
        sortedFiles[fileDate].push(file);
      } else {
        sortedFiles[fileDate] = [file];
      }
    });
    return sortedFiles;
  }

  toggleCheckBox = (index, did) => {
    if (this.isSelected(index, did)) {
      this.setState({
        selectedFileIdsByGroup: this.removeFromMap(this.state.selectedFileIdsByGroup, index, did),
        unselectedFileIdsByGroup: this.addToMap(this.state.unselectedFileIdsByGroup, index, did)
      });
    } else {
      this.setState({
        selectedFileIdsByGroup: this.addToMap(this.state.selectedFileIdsByGroup, index, did),
        unselectedFileIdsByGroup: this.removeFromMap(this.state.unselectedFileIdsByGroup, index, did)
      })
    }
  }

  toggleSelectAll = index => {
    if (this.state.unselectedFileIdsByGroup[index].length == 0) {
      this.setState({
        unselectedFileIdsByGroup: this.setMapValue(this.state.unselectedFileIdsByGroup, index, this.state.selectedFileIdsByGroup[index]),
        selectedFileIdsByGroup: this.setMapValue(this.state.selectedFileIdsByGroup, index, [])
      })
    } else {
      const newIds = this.state.selectedFileIdsByGroup[index].concat(this.state.unselectedFileIdsByGroup[index]);
      this.setState({
        selectedFileIdsByGroup: this.setMapValue(this.state.selectedFileIdsByGroup, index, newIds),
        unselectedFileIdsByGroup: this.setMapValue(this.state.unselectedFileIdsByGroup, index, [])
      })
    }
  }

  render() {
    let buttons = [
      <Dropdown buttonType='primary'>
        <Dropdown.Button>
            Download Template
        </Dropdown.Button>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => console.log('TSV clicked')} rightIcon='download'>TSV</Dropdown.Item>
          <Dropdown.Item onClick={() => console.log('JSON clicked')} rightIcon='download'>JSON</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>,
      <Button
        onClick={() => console.log('map')}
        label='Map Files'
        rightIcon='graph'
        buttonType='primary'
        className='g3-icon g3-icon--lg'
      />
    ];

    return (
      <div className='map-files'>
        <BackLink url='/submission' label='Back to Data Submission' />
        <div className='h1-typo'>My Files</div>
        <StickyToolbar
          title="Unmapped Files"
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
                        files.map(file =>
                          <tr key={file.did} className='map-files__table-row'>
                            <td className='map-files__table-checkbox'>
                              <CheckBox
                                id={file.did}
                                item={file}
                                isSelected={this.isSelected(i, file.did)}
                                onChange={() => this.toggleCheckBox(i, file.did)}
                              />
                            </td>
                            <td>{file.file_name}</td>
                            <td>{file.size}B</td>
                            <td>{moment(file.created_date).format('MM/DD/YY, hh:mm:ss a Z')}</td>
                            <td>Generating</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </React.Fragment>
              )})
          }
        </div>
      </div>
    );
  }
}

MapFiles.propTypes = {
  unmappedFiles: PropTypes.array,
};

MapFiles.defaultProps = {
  unmappedFiles: [],
};

export default MapFiles;
