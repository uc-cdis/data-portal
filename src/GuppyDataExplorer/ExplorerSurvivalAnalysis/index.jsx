import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { getGQLFilter } from '@pcdc/guppy/dist/components/Utils/queries';
import { enumFilterList } from '../../params';
import Spinner from '../../components/Spinner';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import { filterSurvivalByTime, getFactors } from './utils';
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
 * @param {boolean} prop.isAggsDataLoading
 * @param {Array} prop.fieldMapping
 * @param {Object} prop.filter
 */
function ExplorerSurvivalAnalysis({
  aggsData,
  isAggsDataLoading,
  fieldMapping,
  filter,
}) {
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
  const getNewColorScheme = (/** @type {SurvivalData[]} */ survival) => {
    if (survival.length === 1) return initColorScheme;

    /** @type {ColorScheme} */
    const newScheme = {};
    let factorValueCount = 0;
    for (const { name } of survival) {
      const factorValue = name.split(',')[0].split('=')[1];
      if (!newScheme.hasOwnProperty(factorValue)) {
        newScheme[factorValue] = schemeCategory10[factorValueCount % 9];
        factorValueCount++;
      }
    }
    return newScheme;
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState(false);
  /** @type {UserInputSubmitHandler} */
  const handleSubmit = ({
    timeInterval,
    startTime,
    endTime,
    shouldUpdateResults,
    ...requestBody
  }) => {
    if (isError) setIsError(false);
    if (isFilterChanged) setIsFilterChanged(false);
    setIsUpdating(true);
    setStratificationVariable(requestBody.stratificationVariable);
    setTimeInterval(timeInterval);
    setStartTime(startTime);
    setEndTime(endTime);

    if (shouldUpdateResults)
      fetchResult({ filter: transformedFilter, ...requestBody })
        .then((result) => {
          setSurvival(result.survival);
          setColorScheme(getNewColorScheme(result.survival));
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
          if (isMounted) setSurvival(result.survival);
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
          isAggsDataLoading={isAggsDataLoading}
          isError={isError}
          isFilterChanged={isFilterChanged}
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
          <SurvivalPlot
            colorScheme={colorScheme}
            data={filterSurvivalByTime(survival, startTime, endTime)}
            notStratified={stratificationVariable === ''}
            timeInterval={timeInterval}
          />
        )}
      </div>
    </div>
  );
}

ExplorerSurvivalAnalysis.propTypes = {
  aggsData: PropTypes.object,
  isAggsDataLoading: PropTypes.bool,
  fieldMapping: PropTypes.array,
  filter: PropTypes.object,
};

ExplorerSurvivalAnalysis.defaultProps = {
  fieldMapping: [],
};

export default React.memo(ExplorerSurvivalAnalysis);
