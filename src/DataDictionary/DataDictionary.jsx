import React from 'react';
import PropTypes from 'prop-types';
import ReduxDataDictionaryTable from './table/DataDictionaryTable';
import ReduxDataModelStructure from './DataModelStructure';
import DataDictionaryGraph from './graph/DataDictionaryGraph/.';
import './DataDictionary.css';

class DataDictionary extends React.Component {
  setGraphView = (isGraphView) => {
    this.props.onSetGraphView(isGraphView);
  }

  render() {
    return (
      <div className='data-dictionary'>
        <div className='data-dictionary__sidebar'>
          <div className='data-dictionary__switch'>
            <span
              className={`data-dictionary__switch-button ${!this.props.isGraphView ? '' : 'data-dictionary__switch-button--active'}`}
              onClick={() => { this.setGraphView(true); }}
              role='button'
              tabIndex={0}
            >
              Graph View
            </span>
            <span
              className={`data-dictionary__switch-button ${this.props.isGraphView ? '' : 'data-dictionary__switch-button--active'}`}
              onClick={() => { this.setGraphView(false); }}
              role='button'
              tabIndex={0}
            >
              Table View
            </span>
          </div>
          <div className='data-dictionary__model-structure'>
            <ReduxDataModelStructure />
          </div>
          <div className='data-dictionary__search' />
          <div className='data-dictionary__search-history' />
        </div>
        <div
          className='data-dictionary__main'
        >
          <div className={`data-dictionary__table ${!this.props.isGraphView ? '' : 'data-dictionary__table--hidden'}`}>
            <ReduxDataDictionaryTable />
          </div>
          <div className={`data-dictionary__graph ${this.props.isGraphView ? '' : 'data-dictionary__graph--hidden'}`}>
            <DataDictionaryGraph />
          </div>
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
  isGraphView: true,
};


export default DataDictionary;
