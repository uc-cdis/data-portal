import DataDownloadListItem from './DataDownloadListItem';

const CheckThatDataHasTitles = (data:DataDownloadListItem[]): boolean => data.every((obj) => Object.prototype.hasOwnProperty.call(obj, 'title') && obj.title);

export default CheckThatDataHasTitles;
