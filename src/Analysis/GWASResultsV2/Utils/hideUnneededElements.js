import { useEffect } from 'react';

const hideUnneededElements = () => {
  const selectorsToHide = [
    '.analysis-app__description',
    '.back-link',
    '.analysis-app__title',
  ];
  useEffect(() => {
    selectorsToHide.forEach((selector) => {
      document.querySelectorAll(selector).forEach(function(element) {
        element.style.display = 'none';
      });
    });
  }, []);
};

export default hideUnneededElements;
