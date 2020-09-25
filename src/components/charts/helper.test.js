import {
  getCategoryColor,
  getCategoryColorFrom2Colors,
} from './helper';
import { colorsForCharts } from '../../localconf';

describe('helper', () => {
  it('get color', () => {
    const expectColors9 = colorsForCharts.categorical9Colors;
    const colors9 = [];
    for (let i = 0; i < 9; i += 1) {
      colors9.push(getCategoryColor(i));
    }
    expect(colors9).toEqual(expectColors9);

    const expectColors2 = ['#3283c8', '#e7e7e7'];
    const colors2 = [];
    colors2.push(getCategoryColorFrom2Colors(0));
    colors2.push(getCategoryColorFrom2Colors(1));
    expect(colors2).toEqual(expectColors2);
  });
});
