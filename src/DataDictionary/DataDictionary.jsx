import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import Dashboard from '../Layout/Dashboard';
import ReduxDataDictionaryTable from './table/DataDictionaryTable';
import ReduxDataModelStructure from './DataModelStructure';
import DataDictionaryGraph from './graph/DataDictionaryGraph';
import ReduxDictionarySearcher from './search/DictionarySearcher';
import ReduxDictionarySearchHistory from './search/DictionarySearchHistory';
import './DataDictionary.css';

/**
 * @param {Object} props
 * @param {string} props.dataVersion
 * @param {boolean} props.isGraphView
 * @param {(isGraphView: boolean) => void} props.onSetGraphView
 * @param {string} props.portalVersion
 */
function DataDictionary({
  dataVersion,
  isGraphView,
  onSetGraphView,
  portalVersion,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialRenderRef = useRef(true);
  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;

      const searchParamView = searchParams.get('view');
      if (!['graph', 'table'].includes(searchParamView))
        setSearchParams(isGraphView ? 'view=graph' : 'view=table');
      else if (isGraphView !== (searchParamView === 'graph'))
        onSetGraphView(searchParamView === 'graph');
    } else {
      setSearchParams(isGraphView ? 'view=graph' : 'view=table');
    }
  }, [isGraphView]);

  const dictionarySearcherRef = useRef(null);

  function handleClickSearchHistoryItem(keyword) {
    dictionarySearcherRef.current.launchSearchFromOutside(keyword);
  }

  function handleClearSearchResult() {
    dictionarySearcherRef.current.launchClearSearchFromOutside();
  }

  return (
    <Dashboard>
      <Dashboard.Sidebar className='data-dictionary__sidebar'>
        <div>
          <div className='data-dictionary__switch'>
            <span
              className={`data-dictionary__switch-button ${
                !isGraphView ? '' : 'data-dictionary__switch-button--active'
              }`}
              onClick={() => {
                onSetGraphView(true);
              }}
              onKeyPress={(e) => {
                if (e.charCode === 13 || e.charCode === 32) {
                  e.preventDefault();
                  onSetGraphView(true);
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
                isGraphView ? '' : 'data-dictionary__switch-button--active'
              }`}
              onClick={() => {
                onSetGraphView(false);
              }}
              onKeyPress={(e) => {
                if (e.charCode === 13 || e.charCode === 32) {
                  e.preventDefault();
                  onSetGraphView(false);
                }
              }}
              role='button'
              tabIndex={0}
              aria-label='Dictionary view'
            >
              Table View
            </span>
          </div>
          <ReduxDictionarySearcher ref={dictionarySearcherRef} />
          <ReduxDataModelStructure />
          <ReduxDictionarySearchHistory
            onClickSearchHistoryItem={handleClickSearchHistoryItem}
          />
        </div>
        <div className='data-dictionary__version-info-area'>
          <div className='data-dictionary__version-info-list'>
            {dataVersion !== '' && (
              <div className='data-dictionary__version-info'>
                <span>Data Release Version:</span> {dataVersion}
              </div>
            )}
            {portalVersion !== '' && (
              <div className='data-dictionary__version-info'>
                <span>Portal Version:</span> {portalVersion}
              </div>
            )}
          </div>
        </div>
      </Dashboard.Sidebar>
      <Dashboard.Main className='data-dictionary__main'>
        {isGraphView ? (
          <div
            className={`data-dictionary__graph ${
              isGraphView ? '' : 'data-dictionary__graph--hidden'
            }`}
          >
            <DataDictionaryGraph
              onClearSearchResult={handleClearSearchResult}
            />
          </div>
        ) : (
          <div
            className={`data-dictionary__table ${
              !isGraphView ? '' : 'data-dictionary__table--hidden'
            }`}
          >
            <ReduxDataDictionaryTable />
          </div>
        )}
      </Dashboard.Main>
    </Dashboard>
  );
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
