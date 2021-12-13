/* eslint-disable no-shadow */
import { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { getGQLFilter } from '../../GuppyComponents/Utils/queries';
import Spinner from '../../components/Spinner';
import { SurvivalAnalysisConfigType } from '../configTypeDef';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import { fetchWithCreds } from '../../actions';
import './ExplorerSurvivalAnalysis.css';
import './typedef';

/**
 * @param {Object} prop
 * @param {SurvivalAnalysisConfig} prop.config
 * @param {FilterState} prop.filter
 */
function ExplorerSurvivalAnalysis({ config, filter }) {
  const controller = useRef(new AbortController());
  useEffect(() => () => controller.current.abort(), []);
  function fetchResult(body) {
    controller.current.abort();
    controller.current = new AbortController();
    return fetchWithCreds({
      path: '/analysis/tools/survival',
      method: 'POST',
      body: JSON.stringify(body),
      signal: controller.current.signal,
    }).then(({ response, data, status }) => {
      if (status !== 200) throw response.statusText;
      return data;
    });
  }

  const [risktable, setRisktable] = useState([]);
  const [survival, setSurvival] = useState([]);
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

  /** @type {ColorScheme} */
  const initColorScheme = { All: schemeCategory10[0] };
  const [colorScheme, setColorScheme] = useState(initColorScheme);
  const getNewColorScheme = (/** @type {SurvivalData[]} */ survival) => {
    if (survival.length === 1) return initColorScheme;

    /** @type {ColorScheme} */
    const newScheme = {};
    let factorValueCount = 0;
    for (const { group } of survival)
      if (newScheme[group[0].value] === undefined) {
        newScheme[group[0].value] = schemeCategory10[factorValueCount % 9];
        factorValueCount += 1;
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
    ...requestParameter
  }) => {
    if (isError) setIsError(false);
    if (isFilterChanged) setIsFilterChanged(false);
    setIsUpdating(true);
    setTimeInterval(timeInterval);
    setStartTime(startTime);
    setEndTime(endTime);

    if (shouldUpdateResults)
      fetchResult({
        filter: transformedFilter ?? {},
        parameter: requestParameter,
        result: config.result,
      })
        .then((result) => {
          if (config.result?.risktable) setRisktable(result.risktable);
          if (config.result?.survival) {
            setSurvival(result.survival);
            setColorScheme(getNewColorScheme(result.survival));
          }
          setIsUpdating(false);
        })
        .catch((e) => {
          if (e.name !== 'AbortError') {
            setIsError(true);
            setIsUpdating(false);
          }
        });
    else setIsUpdating(false);
  };

  return (
    <div className='explorer-survival-analysis'>
      <div className='explorer-survival-analysis__column-left'>
        <ControlForm
          onSubmit={handleSubmit}
          timeInterval={timeInterval}
          isError={isError}
          isFilterChanged={isFilterChanged}
        />
      </div>
      <div className='explorer-survival-analysis__column-right'>
        {/* eslint-disable-next-line no-nested-ternary */}
        {isUpdating ? (
          <Spinner />
        ) : isError ? (
          <div className='explorer-survival-analysis__error'>
            <h1>Error obtaining survival analysis result...</h1>
            <p>
              Please retry by clicking {'"Apply"'} button or refreshing the
              page. If the problem persists, please contact administrator for
              more information.
            </p>
          </div>
        ) : (
          <>
            {config.result?.survival && (
              <SurvivalPlot
                colorScheme={colorScheme}
                data={survival}
                endTime={endTime}
                startTime={startTime}
                timeInterval={timeInterval}
              />
            )}
            {config.result?.risktable && (
              <RiskTable
                data={risktable}
                endTime={endTime}
                startTime={startTime}
                timeInterval={timeInterval}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

ExplorerSurvivalAnalysis.propTypes = {
  config: SurvivalAnalysisConfigType,
  filter: PropTypes.object,
};

export default memo(ExplorerSurvivalAnalysis);
