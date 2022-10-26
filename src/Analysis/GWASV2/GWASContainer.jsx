import React, { useState } from "react";
import { Space, Button, Popconfirm } from "antd";
import SelectStudyPopulation from "./SelectStudyPopulation/SelectStudyPopulation";
import ProgressBar from "./Shared/ProgressBar/ProgressBar";
import AttritionTable from "./Shared/AttritionTable/AttritionTable";
import {
  useSourceFetch,
  getAllHareItems,
} from "./Shared/wizardEndpoints/cohortMiddlewareApi";
import { gwasV2Steps } from "./Shared/constants";
import "./GWASV2.css";

const GWASContainer = () => {
  const { loading, sourceId } = useSourceFetch();
  const [current, setCurrent] = useState(0);
  const [
    selectedStudyPopulationCohort,
    setSelectedStudyPopulationCohort,
  ] = useState({});
  const [selectedControlCohort, setSelectedControlCohort] = useState(undefined);
  const [selectedCaseCohort, setSelectedCaseCohort] = useState(undefined);
  const [selectedCovariates, setSelectedCovariates] = useState([]);
  const [
    selectedDichotomousCovariates,
    setSelectedDichotomousCovariates,
  ] = useState([]);

  const generateStep = () => {
    // steps 2 & 3 very similar
    switch (current) {
      case 0:
        // select study population
        return (
          <SelectStudyPopulation
            selectedStudyPopulationCohort={selectedStudyPopulationCohort}
            setSelectedStudyPopulationCohort={setSelectedStudyPopulationCohort}
            current={current}
          />
        );
      case 1:
        // outcome (customdichotomous or not)
        return <React.Fragment>step 2</React.Fragment>;
      case 2:
        // covariates (customdichtomous or not)
        return <React.Fragment>step 3</React.Fragment>;
      case 3:
        // all other input (mafs, imputation, etc), review, and submit
        return <React.Fragment>step 4</React.Fragment>;
      default:
        // required for eslint
        return null;
    }
  };

  let nextButtonEnabled = true;
  if (
    current === 0 &&
    Object.keys(selectedStudyPopulationCohort).length === 0
  ) {
    nextButtonEnabled = false;
  }

  // This will be added on step 3
  // This will add a row to a

  //  cohortDefinitionId,
  // subsetCovariates ->  THIS SHOULD BE A NEW FUNCTION
  /*
  Giving input = [A,B,C] // An array of covariates, custom, continous etc.
  Return Output = [[A], [A,B], [A,B,C]]
  Givin Input = [A], out= [A]
  // With each row we want to know how many people have these traits,
*/

  // sourceId -> Prop passed down, don't worry it

  const tempCovariates = [
    {
      variable_type: "custom_dichotomous",
      provided_name: "providednamebyuser",
      cohort_ids: [12, 32],
    },
    {
      variable_type: "concept",
      concept_id: "id",
      concept_name: "concept name",
    },
  ];
  // -> Previously, Objects
  // -> n num of objs of either type custom_dichotomous or concept
  // -> This will be passed to attrituionTable,
  // -> The attrition table should take props similar to parameters to fetchConceptStatsByHareSubset() in Cohort Middle Ware
  // -> The attritiion table will no longer take props selectedCovariates and selectedDichotomousCovariates,
  // -> It will take in  tempCovariates
  // -> Variable type concept is the same as selectedCovariates

  // -> For table's
  /*

  first row props: studyPopulationId, sourceId, covariateSubset = [], phenotype=undefined
  second row props: studyPopulationId, sourceId, covariateSubset = [], phenotype=defined (obj: )
  third row props: studyPopulationId, sourceId, covariateSubset = [A], phenotype=defined
  fourth row props: studyPopulationId, sourceId, covariateSubset = [A, B], phenotype=defined

  Phenotype: Same as "outcome", from Quantitive version of attribution table

  */

  return (
    <React.Fragment>
      <ProgressBar current={current} />

      {!loading && sourceId && (
        <React.Fragment>
          <AttritionTable
            sourceId={sourceId}
            selectedCohort={selectedStudyPopulationCohort}
            otherSelectedCohort={selectedControlCohort}
            // outcome={outcome}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            tableHeader={"Case Cohort Attrition Table"}
          />
          <AttritionTable
            sourceId={sourceId}
            selectedCohort={selectedControlCohort}
            otherSelectedCohort={selectedCaseCohort}
            // outcome={outcome}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            tableHeader={"Control Cohort Attrition Table"}
          />
        </React.Fragment>
      )}

      {/* Inline style block needed so centering rule doesn't impact other workflows */}
      <style>
        {".analysis-app__actions > div:nth-child(1) { width: 100%; }"}
      </style>
      <div className="GWASV2">
        <Space direction={"vertical"} style={{ width: "100%" }}>
          <div className="steps-content">
            <Space
              direction={"vertical"}
              align={"center"}
              style={{ width: "100%" }}
            >
              {generateStep(current)}
            </Space>
          </div>
          <div className="steps-action">
            <Button
              className="GWASUI-navBtn GWASUI-navBtn__next"
              type="primary"
              onClick={() => {
                setCurrent(current - 1);
              }}
              disabled={current < 1}
            >
              Previous
            </Button>
            <Popconfirm
              title="Are you sure you want to leave this page?"
              //   onConfirm={() => resetGWASType()}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" size="medium">
                Select Different GWAS Type
              </Button>
            </Popconfirm>
            {current < gwasV2Steps.length - 1 && (
              <Button
                data-tour="next-button"
                className="GWASUI-navBtn GWASUI-navBtn__next"
                type="primary"
                onClick={() => {
                  setCurrent(current + 1);
                }}
                disabled={!nextButtonEnabled}
              >
                Next
              </Button>
            )}
            {current === gwasV2Steps.length - 1 && (
              <div className="GWASUI-navBtn" />
            )}
          </div>
        </Space>
      </div>
    </React.Fragment>
  );
};

export default GWASContainer;
