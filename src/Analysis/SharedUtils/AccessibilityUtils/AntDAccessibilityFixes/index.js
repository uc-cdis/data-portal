import DelayExecution from './Utils/DelayExecution';
import FixPaginationDropDown from './Fixes/FixPaginationDropdown';


const AntDTableAccessibilityFix = () => {
  DelayExecution(FixPaginationDropDown);
};

export { AntDTableAccessibilityFix };
