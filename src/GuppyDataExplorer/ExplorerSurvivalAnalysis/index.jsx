import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { getGQLFilter } from '@gen3/guppy/dist/components/Utils/queries';
import Spinner from '../../components/Spinner';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import { getFactors } from './utils';
import { fetchWithCreds } from '../../actions';
import './ExplorerSurvivalAnalysis.css';
import './typedef';

const fetchResult = (body) =>
  fetchWithCreds({
    path: '/analysis/tools/survival',
    method: 'POST',
    body: JSON.stringify(body),
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return data;
  });

/**
 * @param {Object} prop
 * @param {Object} prop.aggsData
 * @param {Object} prop.filter
 */
function ExplorerSurvivalAnalysis({ aggsData, filter }) {
  const [pval, setPval] = useState(-1); // -1 is a placeholder for no p-value
  const [risktable, setRisktable] = useState([]);
  const [survival, setSurvival] = useState([]);
  const [stratificationVariable, setStratificationVariable] = useState('');
  const [timeInterval, setTimeInterval] = useState(2);

  const [transformedFilter, setTransformedFilter] = useState(
    getGQLFilter(filter)
  );
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  useEffect(() => {
    const updatedFilter = getGQLFilter(filter);
    if (JSON.stringify(updatedFilter) !== JSON.stringify(transformedFilter)) {
      setTransformedFilter(updatedFilter);
      setIsFilterChanged(true);
    }
  }, [filter]);

  const [factors, setFactors] = useState(getFactors(aggsData));
  useEffect(() => {
    setFactors(getFactors(aggsData));
  }, [aggsData]);

  /** @type {ColorScheme} */
  const initColorScheme = { All: schemeCategory10[0] };
  const [colorScheme, setColorScheme] = useState(initColorScheme);
  const getNewColorScheme = (/** @type {string} */ factorVariable) => {
    if (factorVariable === '') return initColorScheme;

    /** @type {ColorScheme} */
    const newScheme = {};
    const factorValues = aggsData[factorVariable].histogram.map((x) => x.key);
    for (let i = 0; i < factorValues.length; i++)
      newScheme[factorValues[i]] = schemeCategory10[i % 9];
    return newScheme;
  };

  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(true);
  /** @type {UserInputSubmitHandler} */
  const handleSubmit = ({ timeInterval, ...requestBody }) => {
    if (isError) setIsError(false);
    setIsFetching(true);
    setColorScheme(getNewColorScheme(requestBody.factorVariable));
    setStratificationVariable(requestBody.stratificationVariable);
    setTimeInterval(timeInterval);

    fetchResult({ filter: transformedFilter, ...requestBody })
      .then((result) => {
        setPval(result.pval ? +parseFloat(result.pval).toFixed(4) : -1);
        setRisktable(result.risktable);
        setSurvival(result.survival);
      })
      .catch((e) => setIsError(true))
      .finally(() => setIsFetching(false));
  };

  return (
    <div className='explorer-survival-analysis'>
      <div className='explorer-survival-analysis__column-left'>
        <ControlForm
          factors={factors}
          onSubmit={handleSubmit}
          timeInterval={timeInterval}
          isError={isError}
          isFilterChanged={isFilterChanged}
          setIsFilterChanged={setIsFilterChanged}
        />
      </div>
      <div className='explorer-survival-analysis__column-right'>
        {isFetching ? (
          <Spinner />
        ) : isError ? (
          <div className='explorer-survival-analysis__error'>
            <h1>Error obtaining survival analysis result...</h1>
            <p>
              Please retry by clicking "Apply" button or refreshing the page. If
              the problem persists, please contact administrator for more
              information.
            </p>
          </div>
        ) : (
          <>
            <div className='explorer-survival-analysis__pval'>
              {pval >= 0 && `Log-rank test p-value: ${pval}`}
            </div>
            <SurvivalPlot
              colorScheme={colorScheme}
              data={survival}
              notStratified={stratificationVariable === ''}
              timeInterval={timeInterval}
            />
            <RiskTable
              data={risktable}
              notStratified={stratificationVariable === ''}
              timeInterval={timeInterval}
            />
          </>
        )}
      </div>
    </div>
  );
}

ExplorerSurvivalAnalysis.propTypes = {
  aggsData: PropTypes.object,
  filter: PropTypes.object,
};

export default React.memo(ExplorerSurvivalAnalysis);
