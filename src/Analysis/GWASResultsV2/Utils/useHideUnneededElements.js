import { useEffect } from 'react';

const useHideUnneededElements = () => {
  const selectorsToHide = [
    '.analysis-app__description',
    '.back-link',
    '.analysis-app__title',
  ];
  useEffect(() => {
    selectorsToHide.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.style.display = 'none';
      });
    });
  }, []);
};

export default useHideUnneededElements;
