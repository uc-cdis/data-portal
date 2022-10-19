import React from "react";
import Enzyme, { render, mount, first } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ProgressBar from "./ProgressBar";

Enzyme.configure({ adapter: new Adapter() });

/*
  Code to aid in Jest Mocking,
  see
  https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
*/
window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
    };
  };

/* HELPER METHODS */
const testElementText = (wrapper, elNum, text) => {
  const testElement = wrapper.find(
    "div.ant-steps-item:nth-child(" + elNum + ")"
  );
  expect(testElement).toHaveLength(1);
  expect(testElement.text()).toEqual(text);
};

const testElementClass = (wrapper, elNum, className) => {
  /* Enzyme has problems using Selectors, work around from:
    https://stackoverflow.com/questions/56145868/how-to-test-all-children-from-a-selector-except-the-first-child-in-jest
  */
  wrapper.find("div.ant-steps-item").forEach(function(item, index) {
    if (index === elNum - 1) {
      expect(item.hasClass(className)).toEqual(true);
    } else {
      expect(item.hasClass(className)).toEqual(false);
    }
  });
};

/* TESTS */

/* Test active step class */
describe("Test that active step class renders with active class when current is zero", () => {
  const wrapper = mount(<ProgressBar current={0} />);
  it("should render first step with active class when current is zero", () => {
    testElementClass(wrapper, 1, "ant-steps-item-active");
  });
});
describe("Test that active step class renders with active class when current is one", () => {
  const wrapper = mount(<ProgressBar current={1} />);
  it("should render second step with active class when current is one", () => {
    testElementClass(wrapper, 2, "ant-steps-item-active");
  });
});
describe("Test that active step class renders with active class when current is two", () => {
  const wrapper = mount(<ProgressBar current={2} />);
  it("should render third step with active class when current is two", () => {
    testElementClass(wrapper, 3, "ant-steps-item-active");
  });
});
describe("Test that active step class renders with active class when current is three", () => {
  const wrapper = mount(<ProgressBar current={3} />);
  it("should render fourth step with active class when current is three", () => {
    testElementClass(wrapper, 4, "ant-steps-item-active");
  });
});

/* Test Dynamic Text for Steps */
describe("Test that each step renders with correct text when current is zero", () => {
  const wrapper = render(<ProgressBar current={0} />);
  it("should render first step", () => {
    testElementText(wrapper, 1, "1Select Study Population");
  });
  it("should render second step", () => {
    testElementText(wrapper, 2, "2Select Outcome Phenotype");
  });
  it("should render third step", () => {
    testElementText(wrapper, 3, "3Select Covariate Phenotype");
  });
  it("should render fourth step", () => {
    testElementText(wrapper, 4, "4Configure GWAS");
  });
});

describe("Test that each step renders with correct text when current is one", () => {
  const wrapper = render(<ProgressBar current={1} />);
  it("should render first step", () => {
    testElementText(wrapper, 1, "1Edit Study Population");
  });
  it("should render second step", () => {
    testElementText(wrapper, 2, "2Select Outcome Phenotype");
  });
  it("should render third step", () => {
    testElementText(wrapper, 3, "3Select Covariate Phenotype");
  });
  it("should render fourth step", () => {
    testElementText(wrapper, 4, "4Configure GWAS");
  });
});
describe("Test that each step renders with correct text when current is two", () => {
  const wrapper = render(<ProgressBar current={2} />);
  it("should render first step", () => {
    testElementText(wrapper, 1, "1Edit Study Population");
  });
  it("should render second step", () => {
    testElementText(wrapper, 2, "2Edit Outcome Phenotype");
  });
  it("should render third step", () => {
    testElementText(wrapper, 3, "3Select Covariate Phenotype");
  });
  it("should render fourth step", () => {
    testElementText(wrapper, 4, "4Configure GWAS");
  });
});
describe("Test that each step renders with correct text when current is three", () => {
  const wrapper = render(<ProgressBar current={3} />);
  it("should render first step", () => {
    testElementText(wrapper, 1, "1Edit Study Population");
  });
  it("should render second step", () => {
    testElementText(wrapper, 2, "2Edit Outcome Phenotype");
  });
  it("should render third step", () => {
    testElementText(wrapper, 3, "3Edit Covariate Phenotype");
  });
  it("should render fourth step", () => {
    testElementText(wrapper, 4, "4Configure GWAS");
  });
});
