import { DELAY_TIME } from './Utils/Constants';
import DelayExecution from './Utils/DelayExecution';
import RemoveDOMAttribute from './Utils/RemoveDOMAttribute';


const fixPaginationDropDown = () => {
    const pageDropdown = document.querySelector('.ant-pagination-options-size-changer');
    const handleClick = () => {
      console.log('called handleClick');
      RemoveDOMAttribute(
          '.ant-select-item-option-active',
          'aria-selected'
        );
        RemoveDOMAttribute(
          '.ant-select-item',
          'aria-selected'
        );
    }
    if(pageDropdown) {
      pageDropdown.addEventListener('click', handleClick);
      console.log(pageDropdown);
    }
}

const AntDTableAccessibilityFix = () => {
  console.log('called fix');
 DelayExecution(fixPaginationDropDown);

};

export { AntDTableAccessibilityFix };
