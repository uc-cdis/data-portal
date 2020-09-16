import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getGQLFilter } from '@gen3/guppy/dist/components/Utils/queries';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import {
  factors as mockFactors,
  fetchResult as fetchMockSurvivalResult,
} from './mockData';
import './ExplorerSurvivalAnalysis.css';
import './typedef';

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

  const [transformedFilter, setTransformedFilter] = useState({});
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  useEffect(() => {
    setTransformedFilter(getGQLFilter(filter));
    setIsFilterChanged(true);
  }, [filter]);

  /**
   * @type {UserInputSubmitHandler}
   */
  const handleSubmit = ({ timeInterval, ...requestBody }) => {
    setStratificationVariable(requestBody.stratificationVariable);
    setTimeInterval(timeInterval);

    fetchMockSurvivalResult(requestBody).then((result) => {
      setPval(result.pval ? +parseFloat(result.pval).toFixed(4) : -1);
      setRisktable(result.risktable);
      setSurvival(result.survival);
    });
  };

  return (
    <div className='explorer-survival-analysis'>
      <div className='explorer-survival-analysis__warning'>
        WARNING: This component is currently using mocked survival result and
        does not fully implement the intended functionality.
      </div>
      <div className='explorer-survival-analysis__column-left'>
        <ControlForm
          factors={mockFactors}
          onSubmit={handleSubmit}
          timeInterval={timeInterval}
          isFilterChanged={isFilterChanged}
          setIsFilterChanged={setIsFilterChanged}
        />
      </div>
      <div className='explorer-survival-analysis__column-right'>
        <div className='explorer-survival-analysis__pval'>
          {pval >= 0 && `Log-rank test p-value: ${pval}`}
        </div>
        <SurvivalPlot
          data={survival}
          stratificationVariable={stratificationVariable}
          timeInterval={timeInterval}
        />
        <RiskTable data={risktable} timeInterval={timeInterval} />
      </div>
    </div>
  );
}

ExplorerSurvivalAnalysis.propTypes = {
  aggsData: PropTypes.object,
  filter: PropTypes.object,
};

export default ExplorerSurvivalAnalysis;
