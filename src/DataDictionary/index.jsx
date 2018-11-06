import React from 'react';
import ReduxDataDictionaryTable from './table/ReduxDataDictionaryTable';
import DataDictionaryGraph from './graph/DataDictionaryGraph';
import './DataDictionary.css';

class DataDictionary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphView: true,
    };
    this.rightElement = React.createRef();
  }

  componentDidMount() {
  }

  setGraphView = (isGraphView) => {
    this.setState({
      graphView: isGraphView,
    });
  }

  render() {
    return (
      <div className='data-dictionary'>
        <div className='data-dictionary__left'>
          <div className='data-dictionary__switch'>
            <span
              className={`data-dictionary__switch-button ${this.state.graphView ? '' : 'data-dictionary__switch-button--active'}`}
              onClick={() => { this.setGraphView(false); }}
            >
              Table
            </span>
            <span
              className={`data-dictionary__switch-button ${!this.state.graphView ? '' : 'data-dictionary__switch-button--active'}`}
              onClick={() => { this.setGraphView(true); }}
            >
              Graph
            </span>
          </div>
          <div className='data-dictionary__model-structure' />
          <div className='data-dictionary__search' />
          <div className='data-dictionary__search-history' />
        </div>
        <div
          className='data-dictionary__right'
        >
          <div className={`data-dictionary__table ${!this.state.graphView ? '' : 'data-dictionary__table--hidden'}`}>
            <ReduxDataDictionaryTable />
          </div>
          <div className={`data-dictionary__graph ${this.state.graphView ? '' : 'data-dictionary__graph--hidden'}`}>
            <DataDictionaryGraph />
          </div>
        </div>
      </div>
    );
  }
}

export default DataDictionary;
