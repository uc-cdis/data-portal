import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { isEqual } from 'lodash';
import { gwasWorkflowPath } from '../../../../../localconf';
import IsJsonString from '../../../Utils/IsJsonString';
import SharedContext from '../../../Utils/SharedContext';
import LoadingErrorMessage from '../../../Components/LoadingErrorMessage/LoadingErrorMessage';

const JobDetails = ({ attritionTableData }) => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const endpoint = `${gwasWorkflowPath}status/${name}?uid=${uid}`;

  const fetchData = async () => {
    const res = await fetch(endpoint);
    return res.json();
  };

  const { data, status } = useQuery('jobDetails', fetchData);

  if (status === 'error') {
    return <LoadingErrorMessage message='Error getting job details' />;
  }
  if (status === 'loading') {
    return (
      <div className='spinner-container' data-testid='spinner'>
        <Spin />
      </div>
    );
  }

  if (!data || data.length === 0 || data.error) {
    return <LoadingErrorMessage message='Issue Loading Data for Job Details' />;
  }

  console.log('Job Details Data:', data);
  const getParameterData = (key) => {
    const datum = data?.arguments?.parameters?.find((obj) => obj.name === key);
    return datum?.value || 'Unexpected Error';
  };

  const getPhenotype = () => {
    if (
      getParameterData('outcome') &&
      IsJsonString(getParameterData('outcome'))
    ) {
      return (
        JSON.parse(getParameterData('outcome'))?.concept_name ||
        JSON.parse(getParameterData('outcome'))?.provided_name
      );
    }
    /* eslint-disable-next-line no-console */
    console.error('Data not found or not in expected JSON format');
    return 'Unexpected Error';
  };

  const removeOutcomeFromVariablesData = (variablesArray) => {
    const outcome = JSON.parse(getParameterData('outcome'));
    const filteredResult = variablesArray.filter(
      (obj) => !isEqual(obj, outcome)
    );
    return filteredResult;
  };

  const processCovariates = () => {
    const variablesData = getParameterData('variables');
    if (IsJsonString(variablesData)) {
      const covariatesArray = removeOutcomeFromVariablesData(
        JSON.parse(variablesData)
      );
      return covariatesArray;
    }
    return false;
  };

  const displayCovariates = () => {
    const covariates = processCovariates();
    if (covariates && covariates.length > 0) {
      return covariates.map((obj, index) => (
        <React.Fragment key={index}>
          <span className='covariate-item'>
            {obj?.concept_name}
            {obj?.provided_name}
            {!obj?.concept_name && !obj?.provided_name && 'Unexpected Error'}
          </span>
          <br />
        </React.Fragment>
      ));
    }
    return 'No covariates';
  };

  const findAncestrySizeOfLastRow = (tableData, hareAncestry) => {
    console.log(
      'tableData?.rows[tableData?.rows.length - 1]',
      tableData?.rows[tableData?.rows.length - 1]
    );
    const lastRowOfData = tableData?.rows[tableData?.rows.length - 1];
    const datum = lastRowOfData?.concept_breakdown.find(
      (obj) => obj.concept_value_name === hareAncestry
    );
    return datum?.persons_in_cohort_with_value || 'Unexpected Error';
  };

  const displayTotalSizes = () => {
    console.log('data from Attrition Table Wrapper', attritionTableData);
    console.log('hare ancestory');
    const hareAncestry = getParameterData('hare_population');
    const caseSize =
      attritionTableData[0]?.rows &&
      findAncestrySizeOfLastRow(attritionTableData[0], hareAncestry);
    const controlSize = attritionTableData[1]?.rows
      ? findAncestrySizeOfLastRow(attritionTableData[1], hareAncestry)
      : null;
    const totalSize = controlSize !== null ? caseSize + controlSize : caseSize;
    return controlSize === null ? (
      <div className='GWASResults-flex-row'>
        <div>Total Size</div>
        <div>{totalSize || '---'}</div>
      </div>
    ) : (
      <React.Fragment>
        <div className='GWASResults-flex-row'>
          <div>Control Size</div>
          <div>{controlSize}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Case Size</div>
          <div>{caseSize}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Total Size</div>
          <div>{totalSize}</div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <section data-testid='job-details' className='job-details'>
      <h2 className='job-details-title'>{data.wf_name}</h2>
      <div className='GWASResults-flex-col job-details-table'>
        <div className='GWASResults-flex-row'>
          <div>Number of PCs</div>
          <div>{getParameterData('n_pcs')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>MAF Cutoff</div>
          <div>{getParameterData('maf_threshold')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>HARE Ancestry</div>
          <div>{getParameterData('hare_population')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Imputation Score Cutoff</div>
          <div>{getParameterData('imputation_score_cutoff')}</div>
        </div>
        <hr />
        <div className='GWASResults-flex-row'>
          <div>Cohort</div>
          <div>{getParameterData('source_population_cohort')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Phenotype</div>
          <div>{getPhenotype()}</div>
        </div>
        {displayTotalSizes()}
        <div className='GWASResults-flex-row'>
          <div>Covariates</div>
          <div>{displayCovariates()}</div>
        </div>
      </div>
    </section>
  );
};

JobDetails.propTypes = {
  attritionTableData: PropTypes.array.isRequired,
};

export default JobDetails;
