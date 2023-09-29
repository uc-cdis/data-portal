import DataDownloadListItem from './DataDownloadListItem';

const CheckThatDataHasTitles = (data:DataDownloadListItem[]): boolean => data.every((obj) => obj.hasOwnProperty('title') && obj.title);

export default CheckThatDataHasTitles;
