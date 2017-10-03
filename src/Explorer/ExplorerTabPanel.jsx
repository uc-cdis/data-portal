import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ExplorerTabs, ExplorerTab, ExplorerTabBox } from './style';
import { ExplorerTableComponent } from './ExplorerTable';
import { getReduxStore } from '../reduxStore';

const makeDefaultState = () => ({
  activeTabIndex: '',
});

class TabSetComponent extends Component {
  static propTypes = {
    filesMap: PropTypes.object.isRequired,
    lastPageSizes: PropTypes.object.isRequired,
    pageSize: PropTypes.number,
    pagesPerTab: PropTypes.number,
    cursors: PropTypes.object,
    onPageLoadMore: PropTypes.func,
  };

  static defaultProps = {
    cursors: {},
    pageSize: 20,
    pagesPerTab: 5,
    onPageLoadMore: () => {},
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

  updateTab(key, newValue) {
    const numberOfItemPages = this.props.pageSize * this.props.pagesPerTab;
    const newCursors = Object.keys(this.props.cursors).reduce(
      (d, it) => {
        const result = d;
        if (it !== key) {
          result[it] = this.props.cursors[it] > 0
            ? this.props.cursors[it] - (numberOfItemPages -
            (((2 * numberOfItemPages) - this.props.cursors[it]) % numberOfItemPages))
            : 0;
        } else if (newValue < 0) {
          result[it] = this.props.cursors[it] + (2 * newValue) +
            (((2 * numberOfItemPages) - this.props.cursors[it]) % numberOfItemPages);
        } else {
          result[it] = this.props.cursors[it];
        }
        return result;
      }, {},
    );
    this.props.onPageLoadMore({ cursors: newCursors, originalPageToReset: [key] });
  }

  render() {
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
});

const mapDispatchToProps = dispatch => ({
  onPageLoadMore: (state) => {
    dispatch({
      type: 'REQUEST_NEXT_PART',
      data: state,
    });
  },
});

const ExplorerTabPanel = connect(mapStateToProps, mapDispatchToProps)(TabSetComponent);
export default ExplorerTabPanel;
