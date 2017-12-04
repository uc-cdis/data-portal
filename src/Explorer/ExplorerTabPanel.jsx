import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ExplorerTabs, ExplorerTab, ExplorerTabBox, ExplorerTabFrame } from './style';
import { ExplorerTableComponent } from './ExplorerTable';
import {setActiveTab, requestMoreData, changePage, changePageSize} from "./actions";

const makeDefaultState = () => ({
});

class ExplorerTabPanel extends Component {
  static propTypes = {
    filesMap: PropTypes.object.isRequired,
    lastPageSizes: PropTypes.object.isRequired,
    pageSize: PropTypes.number.isRequired,
    pagesPerTab: PropTypes.number.isRequired,
    activeTab: PropTypes.string.isRequired,
    currentPages: PropTypes.object.isRequired,
    cursors: PropTypes.object,
    queriedCursors: PropTypes.object,
    onTabChange: PropTypes.func.isRequired,
    onPageLoadMore: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onPageChange: PropTypes.func,
  };

  static defaultProps = {
    cursors: {},
    queriedCursors: {},
    onPageLoadMore: () => {},
    onPageSizeChange: () => {},
    onPageChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = makeDefaultState();
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState(makeDefaultState({}));
  }

  updateOriginalPage() {
    return Object.keys(this.props.cursors).reduce(
      (d, it) => {
        d[it] = ((this.props.cursors[it] - 1) / this.props.pageSize)
          - (((this.props.cursors[it] - 1) / this.props.pageSize) % this.props.pagesPerTab);
        return d;
      }, {},
    );
  }

  render() {
    const originalPages = this.updateOriginalPage();
    const flexItem = {
      flexBasis: '80%',
      flexGrow: 1,
    };
    return (
      <div style={flexItem}>
        <ExplorerTabs>
          {
            Object.keys(this.props.filesMap).map(
              (item, i) => (this.props.filesMap[item].length > 0) &&
              <ExplorerTab
                key={i}
                active={(item === this.props.activeTab)}
                onClick={
                  () => this.props.onTabChange({ activeTab: item })
                }
              >
                {item.replace('submitted_', '').replace('_', ' ')}
              </ExplorerTab>)
          }
        </ExplorerTabs>
        <ExplorerTabFrame>
          {
            Object.keys(this.props.filesMap).map(
              (item, i) =>
                (this.props.filesMap[item].length > 0)
                && <ExplorerTabBox key={2 * i} active={(item === this.props.activeTab)}>
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
                        this.props.onPageLoadMore(item,
                          this.props.pageSize * this.props.pagesPerTab,
                          {
                            pageSize: this.props.pageSize,
                            pagesPerTab: this.props.pagesPerTab,
                            cursors: this.props.cursors,
                            queriedCursors: this.props.queriedCursors
                          });
                      }
                    }
                    page={(item in this.props.currentPages)
                      ? this.props.currentPages[item] : 0}
                    onPageChange={
                      (page) => {
                        this.props.onPageChange(item, page, this.props.currentPages);
                      }
                    }
                    onPageLoadPrevMore={
                      () => {
                        this.props.onPageLoadMore(item,
                          -this.props.pageSize * this.props.pagesPerTab,
                          {
                            pageSize: this.props.pageSize,
                            pagesPerTab: this.props.pagesPerTab,
                            cursors: this.props.cursors,
                            queriedCursors: this.props.queriedCursors
                          });
                      }
                    }
                    onPageSizeChange={
                      value => this.props.onPageSizeChange(
                        value,
                        {
                          oldPageSize: this.props.pageSize,
                          pagesPerTab: this.props.pagesPerTab,
                          cursors: this.props.cursors,
                          queriedCursors: this.props.queriedCursors
                        }
                    )}
                  />
                </ExplorerTabBox>,
            )
          }
        </ExplorerTabFrame>
      </div>
    );
  }
}

export default ExplorerTabPanel;
