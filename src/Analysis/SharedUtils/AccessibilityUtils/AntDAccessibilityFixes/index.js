import DelayExecution from './Utils/DelayExecution';
import FixPaginationDropDown from './Fixes/FixPaginationDropdown';

// eslint-disable-next-line import/prefer-default-export
export const AntDTableAccessibilityFix = () => {
  DelayExecution(FixPaginationDropDown);
};
