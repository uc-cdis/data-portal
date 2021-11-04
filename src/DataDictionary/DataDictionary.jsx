import React from 'react';
import PropTypes from 'prop-types';
import Dashboard from '../Layout/Dashboard';
import ReduxDataDictionaryTable from './table/DataDictionaryTable';
import ReduxDataModelStructure from './DataModelStructure';
import DataDictionaryGraph from './graph/DataDictionaryGraph';
import ReduxDictionarySearcher from './search/DictionarySearcher';
import ReduxDictionarySearchHistory from './search/DictionarySearchHistory';
import './DataDictionary.css';

class DataDictionary extends React.Component {
  constructor(props) {
    super(props);
    this.dictionarySearcherRef = React.createRef();
  }

  setGraphView = (isGraphView) => {
    this.props.onSetGraphView(isGraphView);
  };

  handleClickSearchHistoryItem = (keyword) => {
    this.dictionarySearcherRef.current.launchSearchFromOutside(keyword);
  };

  handleClearSearchResult = () => {
    this.dictionarySearcherRef.current.launchClearSearchFromOutside();
  };

  render() {
    return (
      <Dashboard>
        <Dashboard.Sidebar className='data-dictionary__sidebar'>
          <div>
            <div className='data-dictionary__switch'>
              <span
                className={`data-dictionary__switch-button ${
                  !this.props.isGraphView
                    ? ''
                    : 'data-dictionary__switch-button--active'
                }`}
                onClick={() => {
                  this.setGraphView(true);
                }}
                onKeyPress={(e) => {
                  if (e.charCode === 13 || e.charCode === 32) {
                    e.preventDefault();
                    this.setGraphView(true);
                  }
                }}
                role='button'
                tabIndex={0}
                aria-label='Graph view'
              >
                Graph View
              </span>
              <span
                className={`data-dictionary__switch-button ${
                  this.props.isGraphView
                    ? ''
                    : 'data-dictionary__switch-button--active'
                }`}
                onClick={() => {
                  this.setGraphView(false);
                }}
                onKeyPress={(e) => {
                  if (e.charCode === 13 || e.charCode === 32) {
                    e.preventDefault();
                    this.setGraphView(false);
                  }
                }}
                role='button'
                tabIndex={0}
                aria-label='Dictionary view'
              >
                Table View
              </span>
            </div>
            <ReduxDictionarySearcher ref={this.dictionarySearcherRef} />
            <ReduxDataModelStructure />
            <ReduxDictionarySearchHistory
              onClickSearchHistoryItem={this.handleClickSearchHistoryItem}
            />
          </div>
          <div className='data-dictionary__version-info-area'>
            <div className='data-dictionary__version-info-list'>
              {this.props.dataVersion !== '' && (
                <div className='data-dictionary__version-info'>
                  <span>Data Release Version:</span> {this.props.dataVersion}
                </div>
              )}
              {this.props.portalVersion !== '' && (
                <div className='data-dictionary__version-info'>
                  <span>Portal Version:</span> {this.props.portalVersion}
                </div>
              )}
            </div>
          </div>
        </Dashboard.Sidebar>
        <Dashboard.Main className='data-dictionary__main'>
          {this.props.isGraphView ? (
            <div
              className={`data-dictionary__graph ${
                this.props.isGraphView ? '' : 'data-dictionary__graph--hidden'
              }`}
            >
              <DataDictionaryGraph
                onClearSearchResult={this.handleClearSearchResult}
              />
            </div>
          ) : (
            <div
              className={`data-dictionary__table ${
                !this.props.isGraphView ? '' : 'data-dictionary__table--hidden'
              }`}
            >
              <ReduxDataDictionaryTable />
            </div>
          )}
        </Dashboard.Main>
      </Dashboard>
    );
  }
}

DataDictionary.propTypes = {
  dataVersion: PropTypes.string,
  isGraphView: PropTypes.bool,
  onSetGraphView: PropTypes.func,
  portalVersion: PropTypes.string,
};

DataDictionary.defaultProps = {
  onSetGraphView: () => {},
  isGraphView: false,
};

export default DataDictionary;
