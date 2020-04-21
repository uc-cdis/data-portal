import React from 'react';
import PropTypes from 'prop-types';
import ReduxDataDictionaryTable from './table/DataDictionaryTable';
import ReduxDataModelStructure from './DataModelStructure';
import DataDictionaryGraph from './graph/DataDictionaryGraph/.';
import ReduxDictionarySearcher from './search/DictionarySearcher/.';
import ReduxDictionarySearchHistory from './search/DictionarySearchHistory/.';
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
    this.dictionarySearcherRef.current.getWrappedInstance().launchSearchFromOutside(keyword);
  };

  handleClearSearchResult = () => {
    this.dictionarySearcherRef.current.getWrappedInstance().launchClearSearchFromOutside();
  };

  render() {
    return (
      <div className='data-dictionary'>
        <div className='data-dictionary__sidebar'>
          <div className='data-dictionary__switch'>
            <span
              className={`data-dictionary__switch-button ${!this.props.isGraphView ? '' : 'data-dictionary__switch-button--active'}`}
              onClick={() => { this.setGraphView(true); }}
              onKeyPress={() => { this.setGraphView(true); }}
              role='button'
              tabIndex={0}
            >
              Graph View
            </span>
            <span
              className={`data-dictionary__switch-button ${this.props.isGraphView ? '' : 'data-dictionary__switch-button--active'}`}
              onClick={() => { this.setGraphView(false); }}
              onKeyPress={() => { this.setGraphView(true); }}
              role='button'
              tabIndex={0}
            >
              Table View
            </span>
          </div>
          <ReduxDictionarySearcher ref={this.dictionarySearcherRef} />
          <ReduxDataModelStructure />
          <ReduxDictionarySearchHistory
            onClickSearchHistoryItem={this.handleClickSearchHistoryItem}
          />
          <div className='data-dictionary__search-history' />
        </div>
        <div
          className='data-dictionary__main'
        >
          { this.props.isGraphView
            ? (
              <div className={`data-dictionary__graph ${this.props.isGraphView ? '' : 'data-dictionary__graph--hidden'}`}>
                <DataDictionaryGraph
                  onClearSearchResult={this.handleClearSearchResult}
                />
              </div>
            )
            : (
              <div className={`data-dictionary__table ${!this.props.isGraphView ? '' : 'data-dictionary__table--hidden'}`}>
                <ReduxDataDictionaryTable />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

DataDictionary.propTypes = {
  onSetGraphView: PropTypes.func,
  isGraphView: PropTypes.bool,
};

DataDictionary.defaultProps = {
  onSetGraphView: () => {},
  isGraphView: false,
};


export default DataDictionary;
