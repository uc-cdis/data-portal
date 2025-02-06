import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Select, InputNumber, Spin } from 'antd';
import { fetchHistogramInfo } from '../../../Utils/cohortMiddlewareApi';
import queryConfig from '../../../../SharedUtils/QueryConfig';
import Histogram from '../../../../SharedUtils/DataViz/Histogram/Histogram';
import { useSourceContext } from '../../../Utils/Source';
import ACTIONS from '../../../Utils/StateManagement/Actions';
import { MESSAGES } from '../../../Utils/constants';
import FILTERS from '../../../../SharedUtils/FiltersEnumeration';
import './PhenotypeHistogram.css';

const PhenotypeHistogram = ({
  dispatch,
  selectedStudyPopulationCohort,
  selectedCovariates,
  outcome,
  selectedContinuousItem,
  useAnimation,
  handleChangeTransformation,
  handleChangeMinOutlierCutoff,
  handleChangeMaxOutlierCutoff,
}) => {
  const { source } = useSourceContext();
  const [inlineErrorMessage, setInlineErrorMessage] = useState(null);
  const [minOutlierCutoff, setMinOutlierCutoff] = useState(null);
  const [maxOutlierCutoff, setMaxOutlierCutoff] = useState(null);
  const [selectedTransformation, setSelectedTransformation] = useState(null);
  const sourceId = source; // TODO - change name of source to sourceId for clarity
  const { data, status } = useQuery(
    [
      'gethistogramforcurrentlyselectedconcept',
      sourceId,
      selectedStudyPopulationCohort.cohort_definition_id,
      selectedCovariates,
      outcome,
      selectedContinuousItem.concept_id,
      selectedContinuousItem.transformation,
    ],
    () => fetchHistogramInfo(
      sourceId,
      selectedStudyPopulationCohort.cohort_definition_id,
      selectedCovariates,
      outcome,
      selectedContinuousItem.concept_id,
      selectedContinuousItem.transformation,
    ),
    queryConfig,
  );

  useEffect(() => {
    // Validate and give error message if there is no data:
    if (
      data?.bins === null
      || (status === 'success' && data?.bins === undefined)
    ) {
      setInlineErrorMessage(<h4>❌ {MESSAGES.NO_BINS_ERROR.title}</h4>);
      if (dispatch) {
        dispatch({
          type: ACTIONS.ADD_MESSAGE,
          payload: MESSAGES.NO_BINS_ERROR,
        });
      }
    } else {
      setInlineErrorMessage(null);
      if (dispatch) {
        dispatch({
          type: ACTIONS.DELETE_MESSAGE,
          payload: MESSAGES.NO_BINS_ERROR,
        });
      }
    }
  }, [data]);

  if (status === 'error') {
    return <React.Fragment>Error getting data for diagram</React.Fragment>;
  }
  if (status === 'loading') {
    return (
      <div className='histrogram-loading'>
        Fetching histogram data... <Spin />
      </div>
    );
  }
  const histogramArgs = {
    data: data.bins,
    xAxisDataKey: 'start',
    barDataKey: 'personCount',
    barColor: 'darkblue',
    xAxisLegend: selectedContinuousItem.concept_name,
    yAxisLegend: 'Persons',
    useAnimation,
    minCutoff:
      selectedContinuousItem.filters?.find(
        (filter) => filter.type === FILTERS.greaterThanOrEqualTo,
      )?.value ?? undefined,
    maxCutoff:
      selectedContinuousItem.filters?.find(
        (filter) => filter.type === FILTERS.lessThanOrEqualTo,
      )?.value ?? undefined,
  };
  return (
    <React.Fragment>
      {inlineErrorMessage}
      {data.bins !== null && (
        <div>
          <div className='GWASUI-row'>
            <div className='GWASUI-column transformation-dropdown-label'>
              <label
                id='transformation-dropdown-label'
                htmlFor='transformation-select'
              >
                Select Transformation
              </label>
            </div>
            <div className='GWASUI-column transformation-select'>
              <Select
                id='transformation-select'
                showSearch={false}
                labelInValue
                value={selectedTransformation}
                onChange={(value) => {
                  setSelectedTransformation(value);
                  handleChangeTransformation(value);
                }}
                placeholder='-optional transformation-'
                fieldNames={{ label: 'description', value: 'type' }}
                options={[
                  { type: 'log', description: 'log transformation' },
                  { type: 'z_score', description: 'z-score transformation' },
                ]}
                aria-label='Transformation Selection'
                aria-labelledby='transformation-dropdown-label'
              />
            </div>
          </div>
          <Histogram {...histogramArgs} />
          <div className='GWASUI-row outlier-inputs'>
            <div className='GWASUI-column'>
              <label htmlFor='input-minOutlierCutoff'>
                Minimum outlier cutoff
              </label>
            </div>
            <div className='GWASUI-column'>
              <InputNumber
                id='input-minOutlierCutoff'
                value={minOutlierCutoff}
                onChange={(value) => {
                  setMinOutlierCutoff(value);
                  handleChangeMinOutlierCutoff(value);
                }}
                min={data.bins[0]?.start || 0}
                max={
                  maxOutlierCutoff
                  || data.bins[data.bins.length - 1]?.end
                  || 100
                }
                onKeyDown={(e) => {
                  const { key } = e;
                  // Allow only numeric keys, backspace, and delete, and one decimal point
                  if (
                    !/[\d]/.test(key)
                    && key !== 'Backspace'
                    && key !== 'Delete'
                    && key !== 'ArrowLeft'
                    && key !== 'ArrowRight'
                    && (key !== '.' || e.target.value.includes('.'))
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className='GWASUI-column'>
              <label htmlFor='input-maxOutlierCutoff'>
                Maximum outlier cutoff
              </label>
            </div>
            <div className='GWASUI-column'>
              <InputNumber
                id='input-maxOutlierCutoff'
                value={maxOutlierCutoff}
                onChange={(value) => {
                  setMaxOutlierCutoff(value);
                  handleChangeMaxOutlierCutoff(value);
                }}
                min={minOutlierCutoff || data.bins[0]?.start || 0}
                max={data.bins[data.bins.length - 1]?.end || 100}
                onKeyDown={(e) => {
                  const { key } = e;
                  // Allow only numeric keys, backspace, and delete, and one decimal point
                  if (
                    !/[\d]/.test(key)
                    && key !== 'Backspace'
                    && key !== 'Delete'
                    && key !== 'ArrowLeft'
                    && key !== 'ArrowRight'
                    && (key !== '.' || e.target.value.includes('.'))
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

PhenotypeHistogram.propTypes = {
  dispatch: PropTypes.func,
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  outcome: PropTypes.object,
  selectedContinuousItem: PropTypes.object.isRequired,
  useAnimation: PropTypes.bool,
  handleChangeTransformation: PropTypes.func,
  handleChangeMinOutlierCutoff: PropTypes.func,
  handleChangeMaxOutlierCutoff: PropTypes.func,
};

PhenotypeHistogram.defaultProps = {
  dispatch: null,
  selectedCovariates: [],
  outcome: null,
  useAnimation: true,
  handleChangeTransformation: null,
  handleChangeMinOutlierCutoff: null,
  handleChangeMaxOutlierCutoff: null,
};

export default PhenotypeHistogram;
