import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ExplorerTabs, ExplorerTab, ExplorerTabBox } from './style';
import { ExplorerTableComponent } from './ExplorerTable';
import { getReduxStore } from '../reduxStore';
import SelectComponent from '../components/SelectComponent';
import { computeLastPageSizes } from '../utils';

const makeDefaultState = () => ({
  activeTabIndex: ''
});

class TabSetComponent extends Component {
  static propTypes = {
    filesMap: PropTypes.object.isRequired,
    lastPageSizes: PropTypes.object.isRequired,
    pageSize: PropTypes.number.isRequired,
    pagesPerTab: PropTypes.number.isRequired,
    cursors: PropTypes.object,
    queriedCursors: PropTypes.object,
    onPageLoadMore: PropTypes.func,
    onPageSizeChange: PropTypes.func
  };

  static defaultProps = {
    cursors: {},
    queriedCursors: {},
    onPageLoadMore: () => {},
    onPageSizeChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = makeDefaultState();
    this.resetState = this.resetState.bind(this);
  }

  /**
   * Subscribe to Redux updates at update time
   */
  componentWillUpdate() {
    getReduxStore().then(
      (store) => {
        const explorerState = store.getState().explorer;
        if (explorerState.resetActiveTab) {
          const filesMap = explorerState.filesMap;
          let found = false;
          const activeTabIndex = Object.keys(filesMap).reduce(
            (res, item) => {
              if (!found && filesMap[item].length > 0) {
                found = true;
                return item;
              }
              return res;
            }, '',
          );
          this.setState({ activeTabIndex });
          store.dispatch({
            type: 'UNSET_RESET_ACTIVE_TAB',
          });
        }
      },
    );
  }

  resetState() {
    this.setState(makeDefaultState({}));
  }

  updateCursors(key, newValue, pageSize) {
    const numberOfItemPages = pageSize * this.props.pagesPerTab;
    return Object.keys(this.props.cursors).reduce(
      (d, it) => {
        const result = d;
        if (it !== key) {
          result[it] = this.props.queriedCursors
            ? this.props.queriedCursors[it]
            : 0;
        } else if (newValue < 0) {
          let tempRes = this.props.cursors[it] + (2 * newValue) +
            (((2 * numberOfItemPages) - this.props.cursors[it]) % numberOfItemPages);
          result[it] = (tempRes >= 0) ? tempRes: 0
        } else {
          result[it] = this.props.cursors[it];
        }
        return result;
      }, {}
    );
  }

  updateTab(key, newValue) {
    const newCursors = this.updateCursors(key, newValue, this.props.pageSize);
    this.props.onPageLoadMore({ cursors: newCursors, originalPageToReset: [key] });
  }

  updateOriginalPage() {
    return Object.keys(this.props.cursors).reduce(
      (d, it) => {
        d[it] = ((this.props.cursors[it] - 1) / this.props.pageSize)
          - (((this.props.cursors[it] - 1) / this.props.pageSize) % this.props.pagesPerTab);
        return d;
      }, {}
    );
  }

  doSelectChange(value) {
    const newCursors = this.updateCursors('', 0, this.props.pageSize);
    this.props.onPageSizeChange({cursors: newCursors, pageSize: parseInt(value)});
  }

  render() {
    let pageSizeValues = [5, 10, 20, 50];
    let originalPages = this.updateOriginalPage();
    return (
      <div>
        <ExplorerTabs>
          {
            Object.keys(this.props.filesMap).map(
              (item, i) => (this.props.filesMap[item].length > 0) &&
              <ExplorerTab
                key={i}
                active={(item === this.state.activeTabIndex)}
                onClick={() => this.setState({ activeTabIndex: item, reloading: false })}
              >
                {item.replace('submitted_', '').replace('_', ' ')}
              </ExplorerTab>)
          }
        </ExplorerTabs>
        <div>
          <SelectComponent values={pageSizeValues} title={"Page size: "}
                           selectedValue={this.props.pageSize}
                           onChange={(value) => this.doSelectChange(value)}
          />
          {
            Object.keys(this.props.filesMap).map(
              (item, i) =>
                (this.props.filesMap[item].length > 0)
                && <ExplorerTabBox key={2 * i} active={(item === this.state.activeTabIndex)}>
                  <ExplorerTableComponent
                    key={(2 * i) + 1}
                    filesList={this.props.filesMap[item]}
                    name={item}
                    lastPageSize={this.props.lastPageSizes[item]}
                    pageSize={this.props.pageSize}
                    pageCount={this.props.pagesPerTab}
                    originalPage={originalPages[item]}
                    onPageLoadNextMore={
                      () => {
                        this.updateTab(item,
                          this.props.pageSize * this.props.pagesPerTab);
                      }
                    }
                    onPageLoadPrevMore={
                      () => {
                        this.updateTab(item,
                          -this.props.pageSize * this.props.pagesPerTab);
                      }
                    }
                  />
                </ExplorerTabBox>,
            )
          }
          <SelectComponent values={pageSizeValues} title={"Page size: "}
                           selectedValue={this.props.pageSize}
                           onChange={(value) => this.doSelectChange(value)}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filesMap: state.explorer.filesMap,
  lastPageSizes: state.explorer.lastPageSizes,
  pageSize: state.explorer.pageSize,
  pagesPerTab: state.explorer.pagesPerTab,
  cursors: state.explorer.cursors,
  queriedCursors: state.explorer.queriedCursors
});

const mapDispatchToProps = dispatch => ({
  onPageLoadMore: (state) => {
    dispatch({
      type: 'REQUEST_NEXT_PART',
      data: state,
    });
  },
  onPageSizeChange: (state) => {
    dispatch({
      type: 'PAGE_SIZE_CHANGED',
      data: state
    });
  }
});

const ExplorerTabPanel = connect(mapStateToProps, mapDispatchToProps)(TabSetComponent);
export default ExplorerTabPanel;
