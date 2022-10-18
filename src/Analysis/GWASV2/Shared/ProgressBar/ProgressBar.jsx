import React from "react";
import { Step, Steps } from "antd";

const ProgressBar = () => {
  const current = 1;

  return (
    <React.Fragment>
      <Steps current={1}>
        <Step title="Finished" description="This is a description." />
        <Step
          title="In Progress"
          subTitle="Left 00:00:08"
          description="This is a description."
        />
        <Step title="Waiting" description="This is a description." />
      </Steps>
    </React.Fragment>
  );
};

export default ProgressBar;
