import React from "react";
import { Button, Steps } from "antd";

const { Step } = Steps;
const ProgressBar = ({ current }) => {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "60%", float: "left" }}>
        <Steps current={current}>
          <Step
            title={`${current <= 0 ? "Select" : "Edit"} Study Population`}
          />
          <Step
            title={`${current <= 1 ? "Select" : "Edit"} Outcome Phenotype`}
          />
          <Step
            title={`${current <= 2 ? "Select" : "Edit"} Covariate Phenotype`}
          />
          <Step title={`Configure GWAS`} />
        </Steps>
      </div>

      <Button style={{ float: "right" }}>New to GWAS? Get started here</Button>
    </div>
  );
};

export default ProgressBar;
