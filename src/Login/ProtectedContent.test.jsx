import ProtectedContent, { intersection } from './ProtectedContent';

describe('the ProtectedContent container', () => {
  it('can compute the intersection of 2 lists', () => {
    expect(intersection(['a', 'b', 'c', 'd', 'e'], ['c', 'd', 'e', 'f', 'g'])).toEqual(['c', 'd', 'e']);
  });
});