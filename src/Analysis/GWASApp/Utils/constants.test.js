import { addUniqueObjectToArray } from "./constants";

const expectedErrorMsg = 'addUniqueObjectToArray recieved invalid parameters';
describe(' addUniqueObjectToArray', () => {
  it('should add a unique object to array', async () => {
    expect(addUniqueObjectToArray([],{test:1})).toEqual([{test:1}]);
  });
  it('should reject a non-unique object from being added to the array', async () => {
    expect(addUniqueObjectToArray([{test:1},{test:2}],{test:2})).toEqual([{test:1},{test:2}]);
  });
  it(`should reject a non-unique object from being added to the array when object key value pairs are declared
    in different orders`, async () => {
    expect(addUniqueObjectToArray([{test:1}, {test:2, key: 'value'}], {key: 'value', test:2}))
    .toEqual([{test:1},{test:2,key: 'value'}]);
  });
  it('should throw an error if first param is invalid', () => {
    let actualErrorMsg = null;
    try {
      addUniqueObjectToArray('lol',{test:2})
    } catch (e) {
      actualErrorMsg = e.message;
    }
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });
  it('should throw an error if second param is invalid', () => {
    let actualErrorMsg = null;
    try {
      addUniqueObjectToArray([])
    } catch (e) {
      actualErrorMsg = e.message;
    }
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });




});
