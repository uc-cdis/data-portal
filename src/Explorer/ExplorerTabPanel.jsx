import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExplorerTableComponent from './ExplorerTable';
import { capitalizeFirstLetter } from '../utils';
import './ExplorerTabPanel.less';

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
    user: PropTypes.object,
    projectAvail: PropTypes.object,
    onTabChange: PropTypes.func.isRequired,
    onPageLoadMore: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onPageChange: PropTypes.func,
  };

  static defaultProps = {
    cursors: {},
    queriedCursors: {},
    user: {},
    projectAvail: {},
    onPageLoadMore: () => {},
    onPageSizeChange: () => {},
    onPageChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState({});
  }

  updateOriginalPage() {
    return Object.keys(this.props.cursors).reduce(
      (d, it) => {
        const res = d;
        res[it] = ((this.props.cursors[it] - 1) / this.props.pageSize)
          - (((this.props.cursors[it] - 1) / this.props.pageSize) % this.props.pagesPerTab);
        return res;
      }, {},
    );
  }

  render() {
    const originalPages = this.updateOriginalPage();
    return (
      <div className='explorer-tab-panel'>
        <div className='explorer-tab-panel__tab-group'>
          {
            Object.keys(this.props.filesMap).map(
              item => (this.props.filesMap[item].length > 0) &&
              <div
                role='button'
                tabIndex={-1}
                className={item === this.props.activeTab
                  ? 'explorer-tab-panel__tab-item explorer-tab-panel__tab-item--active'
                  : 'explorer-tab-panel__tab-item'}
                key={item}
                active={item === this.props.activeTab ? 'true' : 'false'}
                onClick={
                  () => this.props.onTabChange({ activeTab: item })
                }
              >
                {capitalizeFirstLetter(item)}
              </div>)
          }
        </div>
        <div className='explorer-tab-panel__frame'>
          {
            Object.keys(this.props.filesMap).map(
              item =>
                (this.props.filesMap[item].length > 0)
                &&
                <div
                  className={item === this.props.activeTab
                    ? 'explorer-tab-panel__tab-box--active'
                    : 'explorer-tab-panel__tab-box--inactive'}
                  key={`${item}-tab-box`}
                  active={item === this.props.activeTab ? 'true' : 'false'}
                >
                  <ExplorerTableComponent
                    user={this.props.user}
                    projectAvail={this.props.projectAvail}
                    key={`${item}-tab-box`}
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
                            queriedCursors: this.props.queriedCursors,
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
                            queriedCursors: this.props.queriedCursors,
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
                          queriedCursors: this.props.queriedCursors,
                        },
                      )
                    }
                  />
                </div>,
            )
          }
        </div>
      </div>
    );
  }
}

export default ExplorerTabPanel;
