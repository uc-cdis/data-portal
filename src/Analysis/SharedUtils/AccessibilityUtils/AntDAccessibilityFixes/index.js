import DelayExecution from './Utils/DelayExecution';
import FixPaginationDropDown from './Fixes/FixPaginationDropdown';

export const AntDTableAccessibilityFix = () => {
  DelayExecution(FixPaginationDropDown);
};
