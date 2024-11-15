/*
 * Used to update DOM attributes after component mounts
 * example: useSetDOMAttribute('.ant-radio-input','aria-label', 'Select row for study population')
 */

const delayToAllowDOMRendering = 500;
const SetDOMAttribute = (selector, attribute, value) => {
  setTimeout(() => {
    const elements = document.querySelectorAll(selector);
    elements?.forEach((element) => {
      if (element) {
        element.setAttribute(attribute, value);
      } else {
        /* eslint-disable no-console */
        console.error('Unable to find selector in setDOMAttribute: ', selector);
        /* eslint-enable no-console */
      }
    });
  }, delayToAllowDOMRendering);
};

export default SetDOMAttribute;
