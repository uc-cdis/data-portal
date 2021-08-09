import { colorsForCharts } from '../../localconf';

export const getCategoryColor = (index) => (colorsForCharts.categorical9Colors[index % 9]);

export const getCategoryColorFrom2Colors = (index) => colorsForCharts.categorical2Colors[index % 2];
