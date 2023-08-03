import VIEWS from './ViewsEnumeration';



const useHideUnneededElements = (currentView) => {
  const selectorsToHide = [
    '.analysis-app__description',
    '.analysis-app__title',
  ];

  const setElementsDisplay = (selector, displayValue) => {
    document.querySelectorAll(selector).forEach((element) => {
      const temporaryElement = element;
      temporaryElement.style.display = displayValue;
    });
  }

  const toggleBackLink = () => {
    const backLinkSelector = '.back-link';
    if (currentView === VIEWS.home) {
      setElementsDisplay(backLinkSelector, 'inline');
    }
    else {
      setElementsDisplay(backLinkSelector, 'none');
    }
  }

  selectorsToHide.forEach((selector) => {
    setElementsDisplay(selector, 'none');
  });
  toggleBackLink();
};

export default useHideUnneededElements;
