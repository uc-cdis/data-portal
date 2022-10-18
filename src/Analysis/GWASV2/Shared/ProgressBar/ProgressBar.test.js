import React from "react";
import Enzyme, { render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ProgressBar from "./ProgressBar";

Enzyme.configure({ adapter: new Adapter() });

describe("Test that each step renders with correct text", () => {
  const wrapper = render(<ProgressBar current={0} />);
  it("should render first step", () => {
    const testElement1 = wrapper
      .find(".progress-bar__steps .ant-steps-item")
      .first();
    expect(testElement1).toHaveLength(1);
    expect(testElement1.text()).toEqual("1Select Study Population");
  });
  it("should render second step", () => {
    const testElement2 = wrapper.find("div.ant-steps-item:nth-child(2)");
    expect(testElement2).toHaveLength(1);
    expect(testElement2.text()).toEqual("2Select Outcome Phenotype");
  });
});
