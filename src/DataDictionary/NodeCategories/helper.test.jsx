import IconDefault from './icons/icon_default.svg';
import { getCategoryIconSVG } from './helper';

describe('the DataDictionaryNode', () => {
  it('could generate svg component for undefined types', () => {
    const notDefinedType = 'a_type_that_is_not_defined_because_its_name_is_so_strange';
    expect(getCategoryIconSVG(notDefinedType)).toEqual(IconDefault);
  });
});
