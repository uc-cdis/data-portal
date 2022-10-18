import React from "react";
import { Button, Steps } from "antd";

const { Step } = Steps;
const ProgressBar = ({ current }) => {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "60%", float: "left" }}>
        <Steps current={current}>
          <Step title={`Select Study Population`} />
          <Step title={`Select Outcome Phenotype`} />
          <Step title={`Select Covariate Phenotype`} />
          <Step title={`Configure GWAS`} />
        </Steps>
      </div>

      <Button style={{ float: "right" }}>New to GWAS? Get started here</Button>
    </div>
  );
};

export default ProgressBar;
