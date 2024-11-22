/*
 * Used to update Remove Dom attributes
 * example: RemoveDOMAttribute('.ant-radio-input','aria-selected',)
 */

const RemoveDOMAttribute = (selector, attribute) => {
    const elements = document.querySelectorAll(selector);
    console.log('elements',elements, selector)
    elements?.forEach((element) => {
      if (element) {
        console.log('removing element and attribute', element, attribute);
        element.removeAttribute(attribute);
      } else {
        /* eslint-disable no-console */
        console.error('Unable to find selector in removeDOMAttribute: ', selector);
        /* eslint-enable no-console */
      }
    });
};

export default RemoveDOMAttribute;
