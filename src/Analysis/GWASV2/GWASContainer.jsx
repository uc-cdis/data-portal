import React, { useState } from "react";
import { Space, Button, Popconfirm } from "antd";
import SelectStudyPopulation from "./SelectStudyPopulation/SelectStudyPopulation";
import SelectCovariates from "./Shared/SelectCovariates/SelectCovariates";
import "./GWASV2.css";
import { gwasSteps } from "./constants";
import Outcome from "./Outcome/Outcome";

const GWASContainer = () => {
  const [current, setCurrent] = useState(0);
  const [
    selectedStudyPopulationCohort,
    setSelectedStudyPopulationCohort,
  ] = useState({});
  const [allCovariates, setAllCovariates] = useState([]);
  const [outcome, setOutcome] = useState([]);

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
          />
        );
      case 1:
        // outcome (customdichotomous or not)
        return <Outcome
          handleOutcome={handleOutcome}
          outcome={outcome}
          covariates={[]}
        />
      case 2:
        // covariates (customdichtomous or not)
        return <AllCovariates
          handleCovariates={handleCovariates}
          covariates={allCovariates}
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
      <style>{`.analysis-app__actions > div:nth-child(1) {margin: 0 auto; }`}</style>
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
