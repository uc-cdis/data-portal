import VIEWS from './ViewsEnumeration';

const HideShowTemplateElements = (currentView) => {
  const selectorsToHide = [
    '.analysis-app__description',
    '.analysis-app__title',
  ];
  const backLinkSelector = '.back-link';

  const setElementsDisplay = (selector, displayValue) => {
    document.querySelectorAll(selector).forEach((element) => {
      const temporaryElement = element;
      temporaryElement.style.display = displayValue;
    });
  };

  const toggleBackLink = () => {
    if (currentView === VIEWS.home) {
      setElementsDisplay(backLinkSelector, 'inline');
    } else {
      setElementsDisplay(backLinkSelector, 'none');
    }
  };

  selectorsToHide.forEach((selector) => {
    setElementsDisplay(selector, 'none');
  });

  toggleBackLink();
};

export default HideShowTemplateElements;
