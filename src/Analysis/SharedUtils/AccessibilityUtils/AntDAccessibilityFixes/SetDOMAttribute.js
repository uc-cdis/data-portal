/*
 * Used to update DOM attributes after component mounts
 * example: useSetDOMAttribute('.ant-radio-input',' aria-label', 'radio button')
 */

const SetDOMAttribute = (selector, attribute, value) => {
  const elements = document.querySelectorAll(selector);
  elements?.forEach((element) => {
    if (element) {
      element.setAttribute(attribute, value);
    } else {
      console.error('Unable to find selector in setDOMAttribute: ', selector);
    }
  });
};

export default SetDOMAttribute;
