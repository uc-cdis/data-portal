import isEnterOrSpace from '../../IsEnterOrSpace';
import DelayExecution from '../Utils/DelayExecution';
import RemoveDOMAttribute from '../Utils/RemoveDOMAttribute';

const FixPaginationDropDown = () => {
  const pageDropdown = document.querySelector(
    '.ant-pagination-options-size-changer',
  );
  if (pageDropdown) {
    pageDropdown.addEventListener('click', () => {
      DelayExecution(RemoveDOMAttribute, '.ant-select-item', 'aria-selected');
    });
    pageDropdown.addEventListener('keydown', (event) => {
      if (isEnterOrSpace(event)) {
        DelayExecution(RemoveDOMAttribute, '.ant-select-item', 'aria-selected');
      }
    });
  }
};
export default FixPaginationDropDown;
