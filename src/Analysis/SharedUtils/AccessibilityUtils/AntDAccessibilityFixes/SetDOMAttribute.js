/*
 * Used to update DOM attributes after component mounts
 * example: useSetDOMAttribute('.ant-radio-input',' aria-label', 'radio button')
 */

const delayToAllowDOMRendering = 500;
const SetDOMAttribute = (selector, attribute, value) => {
  setTimeout(() => {
    const elements = document.querySelectorAll(selector);
    elements?.forEach((element) => {
      if (element) {
        element.setAttribute(attribute, value);
      } else {
        console.error('Unable to find selector in setDOMAttribute: ', selector);
      }
    });
  }, delayToAllowDOMRendering);
};

export default SetDOMAttribute;
