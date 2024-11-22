import isEnterOrSpace from '../../IsEnterOrSpace';
import RemoveDOMAttribute from '../Utils/RemoveDOMAttribute';

const FixPaginationDropDown = () => {
  const pageDropdown = document.querySelector(
    '.ant-pagination-options-size-changer',
  );
  if (pageDropdown) {
    pageDropdown.addEventListener('click', () => {
      RemoveDOMAttribute('.ant-select-item', 'aria-selected');
    });
    pageDropdown.addEventListener('keydown', (event) => {
      if (isEnterOrSpace(event)) {
        RemoveDOMAttribute('.ant-select-item', 'aria-selected');
      }
    });
  }
};
export default FixPaginationDropDown;
