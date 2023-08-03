import { useEffect } from 'react';

const useHideUnneededElements = () => {
  const selectorsToHide = [
    '.analysis-app__description',
    '.analysis-app__title',
  ];
  useEffect(() => {
    selectorsToHide.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        const temporaryElement = element;
        temporaryElement.style.display = 'none';
      });
    });
  }, []);
};

export default useHideUnneededElements;
