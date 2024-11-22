const handlePaginationDropdownClick = () => {
    RemoveDOMAttribute(
      '.ant-select-item-option-active',
      'aria-selected',
    );
    RemoveDOMAttribute(
      '.ant-select-item',
      'aria-selected',
    );
  };

const FixPaginationDropDown = () => {
    const pageDropdown = document.querySelector('.ant-pagination-options-size-changer');
    if (pageDropdown) {
      pageDropdown.addEventListener('click', handlePaginationDropdownClick);
    }
  };

  export default FixPaginationDropDown;
