import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { getGQLFilter } from '@gen3/guppy/dist/components/Utils/queries';
import { enumFilterList } from '../../params';
import Spinner from '../../components/Spinner';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import {
  filterRisktableByTime,
  filterSurvivalByTime,
  getFactors,
} from './utils';
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
 * @param {Array} prop.fieldMapping
 * @param {Object} prop.filter
 */
function ExplorerSurvivalAnalysis({ aggsData, fieldMapping, filter }) {
  const [risktable, setRisktable] = useState([]);
  const [survival, setSurvival] = useState([]);
  const [stratificationVariable, setStratificationVariable] = useState('');
  const [timeInterval, setTimeInterval] = useState(2);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(20);

  const [transformedFilter, setTransformedFilter] = useState(
    getGQLFilter(filter)
  );
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  useEffect(() => {
    const updatedFilter = getGQLFilter(cloneDeep(filter));
    if (JSON.stringify(updatedFilter) !== JSON.stringify(transformedFilter)) {
      setTransformedFilter(updatedFilter);
      setIsFilterChanged(true);
    }
  }, [filter]);

  const [factors, setFactors] = useState(
    getFactors(aggsData, fieldMapping, enumFilterList)
  );
  useEffect(() => {
    setFactors(getFactors(aggsData, fieldMapping, enumFilterList));
  }, [aggsData, fieldMapping]);

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

  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState(true);
  /** @type {UserInputSubmitHandler} */
  const handleSubmit = ({
    timeInterval,
    startTime,
    endTime,
    shouldUpdateResults,
    ...requestBody
  }) => {
    if (isError) setIsError(false);
    setIsUpdating(true);
    setColorScheme(getNewColorScheme(requestBody.factorVariable));
    setStratificationVariable(requestBody.stratificationVariable);
    setTimeInterval(timeInterval);
    setStartTime(startTime);
    setEndTime(endTime);

    if (shouldUpdateResults)
      fetchResult({ filter: transformedFilter, ...requestBody })
        .then((result) => {
          setRisktable(result.risktable);
          setSurvival(result.survival);
        })
        .catch((e) => setIsError(true))
        .finally(() => setIsUpdating(false));
    else setIsUpdating(false);
  };
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setIsError(false);
      setIsUpdating(true);
      fetchResult({
        filter: transformedFilter,
        factorVariable: '',
        stratificationVariable: '',
        efsFlag: false,
      })
        .then((result) => {
          if (isMounted) {
            setRisktable(result.risktable);
            setSurvival(result.survival);
          }
        })
        .catch((e) => isMounted && setIsError(true))
        .finally(() => isMounted && setIsUpdating(false));
    }

    return () => (isMounted = false);
  }, []);

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
        {isUpdating ? (
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
            <SurvivalPlot
              colorScheme={colorScheme}
              data={filterSurvivalByTime(survival, startTime, endTime)}
              notStratified={stratificationVariable === ''}
              timeInterval={timeInterval}
            />
            <RiskTable
              data={filterRisktableByTime(risktable, startTime, endTime)}
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
  fieldMapping: PropTypes.array,
  filter: PropTypes.object,
};

ExplorerSurvivalAnalysis.defaultProps = {
  fieldMapping: [],
};

export default React.memo(ExplorerSurvivalAnalysis);
