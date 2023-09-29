import DataDownloadListItem from './Utils/DataDownloadListItem';

const CheckThatDataHasTitles = (data:DataDownloadListItem[]|any[]): boolean => data.every((obj) => Object.prototype.hasOwnProperty.call(obj, 'title') && obj.title);

export default CheckThatDataHasTitles;
