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
        selectedFileDids: [],
        filesByDate: [],
      };
  }

  componentDidMount() {
    this.props.fetchUnmappedFiles();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.unmappedFiles !== this.props.unmappedFiles) {
      this.sortUnmappedFiles()
    }
  }

  shouldBeSelected = did => {
    console.log('should did', did, 'be selected?');
    return this.state.selectedFileDids.includes(did);
  }

  onToggleCheckBox = did => {
    this.state.selectedFileDids.includes(did) ? this.onFileDeselect(did) : this.onFileSelect(did);
  }

  onFileSelect = did => {
    console.log('selecting did', did)
    this.setState({
      selectedFileDids: this.state.selectedFileDids.concat(did),
    });
  }

  onFileDeselect = did => {
    this.setState({
      selectedFileDids: this.state.selectedFileDids.filter(id => id !== did),
    }, () => console.log(this.state.selectedFileDids));
  }

  toggleSelectAll = index => {
    console.log('index is', index)
    let files = this.state.filesByDate[parseInt(index)];
    let allSelected = true;
    console.log('files', files)
    for (let file of files) {
      if (!this.state.selectedFileDids.includes(file.did)) {
        console.log('all are not selected')
        allSelected = false;
        break;
      }
    };
    allSelected ? this.deselectAll(index) : this.selectAll(index);
  }

  deselectAll = index => {
    console.log('deselecting all')
    let ids = [index];
    this.state.filesByDate[index].forEach(file => {
      ids.push(file.did)
    })
    this.setState({
      selectedFileDids: this.state.selectedFileDids.filter(id => !ids.includes(id))
    })
  }

  selectAll = index => {
    console.log('selecting all')
    let ids = [index];
    this.state.filesByDate[index].forEach(file => {
      console.log('checking did', file.did)
      if (!this.state.selectedFileDids.includes(file.did)) {
        ids.push(file.did)
      }
    })
    console.log('final ids are', ids)
    this.setState({
      selectedFileDids: this.state.selectedFileDids.concat(ids)
    })
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
    this.setState({
      filesByDate: Object.values(sortedFiles)
    });
  }

  getTableHeaderText = files => {
    let date = moment(files[0].created_date).format('MM/DD/YY')
    return `uploaded on ${date}, ${files.length} ${files.length > 1 ? 'files' : 'file'}`
  }

  render() {
    let buttons = [
      <Dropdown buttonType='primary'>
        <Dropdown.Button onClick={() => console.log('click')}>
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
            this.state.filesByDate.map((files, i) => (
              <React.Fragment key={i}>
                <div className='h2-typo'>{this.getTableHeaderText(files)}</div>
                <table className='map-files__table'>
                  <tbody>
                    <tr className='map-files__table-header'>
                      <th className='map-files__table-checkbox'>
                        <CheckBox
                          id={`${i}`}
                          isSelected={this.shouldBeSelected(`${i}`)}
                          onChange={this.toggleSelectAll}
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
                              isSelected={this.shouldBeSelected(file.did)}
                              onChange={this.onToggleCheckBox}
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
            ))
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
