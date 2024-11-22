/*
 * Used to update Remove Dom attributes
 * example: RemoveDOMAttribute('.ant-radio-input','aria-selected',)
 */

const RemoveDOMAttribute = (selector, attribute) => {
  const elements = document.querySelectorAll(selector);
  elements?.forEach((element) => {
    if (element) {
      console.log(element);
      element.removeAttribute(attribute);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        'Unable to find selector in removeDOMAttribute: ',
        selector
      );
    }
  });
};

export default RemoveDOMAttribute;
