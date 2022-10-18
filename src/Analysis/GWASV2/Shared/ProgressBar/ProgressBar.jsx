import React from "react";
import { Button, Steps } from "antd";
import "./ProgressBar.css";

const { Step } = Steps;
const ProgressBar = ({ current }) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar__steps">
        <Steps current={current}>
          <Step
            icon={<>1</>}
            title={`${current <= 0 ? "Select" : "Edit"} Study Population`}
          />
          <Step
            icon={<>2</>}
            title={`${current <= 1 ? "Select" : "Edit"} Outcome Phenotype`}
          />
          <Step
            icon={<>3</>}
            title={`${current <= 2 ? "Select" : "Edit"} Covariate Phenotype`}
          />
          <Step icon={<>4</>} title={`Configure GWAS`} />
        </Steps>
      </div>
      <Button>New to GWAS? Get started here</Button>
    </div>
  );
};

export default ProgressBar;
