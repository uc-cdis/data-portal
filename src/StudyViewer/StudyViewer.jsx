import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Result } from 'antd';
import getReduxStore from '../reduxStore';
import {
  fetchDataset, fetchFiles, resetSingleStudyData, fetchStudyViewerConfig, ReduxExportToWorkspace,
} from './reduxer';
import './StudyViewer.css';
import StudyCard from './StudyCard';

class StudyViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataType: undefined,
      exportToWorkspace: {},
      exportingPFBToWorkspace: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.dataType && nextProps.match.params.dataType !== prevState.dataType) {
      return { dataType: nextProps.match.params.dataType };
    }
    return null;
  }

  componentDidMount() {
    if (!this.props.datasets
      && this.state.dataType) {
      getReduxStore().then(
        (store) => Promise.allSettled(
          [
            store.dispatch(fetchDataset(decodeURIComponent(this.state.dataType))),
            store.dispatch(fetchFiles(decodeURIComponent(this.state.dataType), 'object')),
            store.dispatch(resetSingleStudyData()),
          ],
        ));
    }
  }

  getPanelExpandStatus = (openMode, index) => {
    if (openMode === 'open-all') {
      return true;
    } if (openMode === 'close-all') {
      return false;
    }
    return (index === 0);
  }

  exportToWorkspace = (buttonConfig) => {
    this.setState({
      exportToWorkspace: { ...buttonConfig },
    });
  };

  exportingPFBToWorkspaceStateChange = (stateChange) => {
    const tempStateChange = {
      exportingPFBToWorkspace: stateChange,
    };

    // if set to false clear exportToWorkspace
    if (!stateChange) {
      tempStateChange.exportToWorkspace = {};
    }

    this.setState(tempStateChange);
  };

  render() {
    if (this.props.noConfigError) {
      this.props.history.push('/not-found');
    }

    if (!this.props.datasets) {
      return (
        <div className='study-viewer'>
          <div className='study-viewer_loading'>
            <Spin size='large' tip='Loading data...' />
          </div>
        </div>
      );
    }

    const studyViewerConfig = fetchStudyViewerConfig(this.state.dataType);
    const { datasets } = this.props;
    const order = studyViewerConfig.defaultOrderBy;
    if (datasets.length === 0) {
      return (
        <div className='study-viewer'>
          <Result
            title='No data available'
          />
        </div>
      );
    }

    // handle openFirstRowAccessor
    if (datasets.length > 0
      && studyViewerConfig.openMode === 'open-first'
      && studyViewerConfig.openFirstRowAccessor !== ''
      && !order // defaultOrderBy overrides openFirstRowAccessor
    ) {
      datasets.forEach((item, i) => {
        if (item.rowAccessorValue === studyViewerConfig.openFirstRowAccessor) {
          datasets.splice(i, 1);
          datasets.unshift(item);
        }
      });
    }

    // sort items - order = [<field name>, <"asc" (default) or "desc">]
    if (order) {
      const field = order[0];
      const desc = (order.length > 1 && order[1] === 'desc') || false;
      datasets.sort((a, b) => {
        // find the field...
        let aVal = a[field]; // eg 'title', 'rowAccessorValue'...
        let bVal = b[field];
        if (!aVal || !bVal) {
          // eg a field from blockFields or tableFields
          Object.entries(a).forEach(([key, value]) => {
            if (value && value[field]) {
              aVal = value[field];
              bVal = b[key][field];
            }
          });
        }
        if (desc) {
          return (bVal > aVal) ? 1 : -1;
        }
        return (aVal > bVal) ? 1 : -1; // asc by default
      });
    }

    return (
      <div className='study-viewer'>
        <div className='h2-typo study-viewer__title'>
          {studyViewerConfig.title}
        </div>
        <div className='study-cards'>
          {(datasets.length > 0)
            ? (datasets.map((d, i) => (
              <StudyCard
                key={i}
                data={d}
                fileData={this.props.fileData
                  .filter((fd) => fd.rowAccessorValue === d.rowAccessorValue)}
                studyViewerConfig={studyViewerConfig}
                initialPanelExpandStatus={this.getPanelExpandStatus(studyViewerConfig.openMode, i)}
                exportToWorkspaceAction={this.exportToWorkspace}
                exportToWorkspaceEnabled={!this.state.exportingPFBToWorkspace}
              />
            ))
            )
            : null}
        </div>
        <ReduxExportToWorkspace
          exportToWorkspaceAction={this.state.exportToWorkspace}
          exportingPFBToWorkspaceStateChange={this.exportingPFBToWorkspaceStateChange}
          exportingPFBToWorkspace={this.state.exportingPFBToWorkspace}
        />
      </div>
    );
  }
}

StudyViewer.propTypes = {
  datasets: PropTypes.array,
  fileData: PropTypes.array,
  noConfigError: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape(
    {
      params: PropTypes.object,
      path: PropTypes.string,
    },
  ).isRequired,
};

StudyViewer.defaultProps = {
  datasets: undefined,
  fileData: [],
  noConfigError: undefined,
};

export default StudyViewer;
