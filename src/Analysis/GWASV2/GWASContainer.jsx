import React, { useState } from "react";
import { Space, Button, Popconfirm } from "antd";
import SelectStudyPopulation from "./SelectStudyPopulation/SelectStudyPopulation";
import SelectOutcome from "./SelectOutcome/SelectOutcome";
import SelectCovariates from "./SelectCovariates/SelectCovariates";
import "./GWASV2.css";
import { gwasSteps } from "./constants";
import { useSourceFetch } from "../GWASWizard/wizardEndpoints/cohortMiddlewareApi";
import { Spin } from "antd";

const GWASContainer = () => {
  const [current, setCurrent] = useState(0);
  const [
    selectedStudyPopulationCohort,
    setSelectedStudyPopulationCohort,
  ] = useState({});
  const [allCovariates, setAllCovariates] = useState([]);
  const [outcome, setOutcome] = useState({});
  const { loading, sourceId } = useSourceFetch();

  const handleCovariates = (cov) => {
    console.log('cov', cov)
  }

  const handleOutcome = () => {
    console.log('outcome');
  }

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
            sourceId={sourceId}
          />
        );
      case 1:
        // outcome (customdichotomous or not)
        return <SelectOutcome
          outcome={outcome}
          allCovariates={allCovariates}
          handleOutcome={handleOutcome}
          sourceId={sourceId}
        />
      case 2:
        // covariates (customdichtomous or not)
        return <SelectCovariates
          handleCovariates={handleCovariates}
          covariates={allCovariates}
          sourceId={sourceId}
        />;

      case 3:
        // all other input (mafs, imputation, etc), review, and submit
        return <React.Fragment>step 4</React.Fragment>;
      default:
        // required for eslint
        return null;
    }
  };
  return (
    <React.Fragment>
      {/* Inline style block needed so centering rule doesn't impact other workflows */}
      <style>
        {`.analysis-app__actions > div:nth-child(1) { ${current === 0 ? `margin: 0 auto;` : ``}  ${current === 1 || 2 ? `marginLeft: 0` : ``} }`}
      </style>
      <div className="GWASV2">
        <Space direction={"vertical"} style={{ width: "100%" }}>
          <div className="steps-content">
            <Space
              direction={"vertical"}
              align={"center"}
              style={{ width: "100%" }}
            >
              {!loading && sourceId ? generateStep(current) : (
                <Spin />
              )}
            </Space>
          </div>
          <div className="steps-action" style={{minWidth: "95vw", margin: "auto", marginLeft: 10}}>
            <Button
              className="GWASUI-navBtn GWASUI-navBtn__next"
              type="primary"
              onClick={() => {
                setCurrent(current - 1);
              }}
              disabled={current < 1 ? true : false}
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
            {current < gwasSteps.length - 1 && (
              <Button
                data-tour="next-button"
                className="GWASUI-navBtn GWASUI-navBtn__next"
                type="primary"
                onClick={() => {
                  setCurrent(current + 1);
                }}
              // disabled={!nextButtonEnabled}
              >
                Next
              </Button>
            )}
            {current === gwasSteps.length - 1 && (
              <div className="GWASUI-navBtn" />
            )}
          </div>
        </Space>
      </div>
    </React.Fragment>
  );
};

export default GWASContainer;
