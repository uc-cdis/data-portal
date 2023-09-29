import DataDownloadListItem from "./Utils/DataDownloadListItem";
const CheckThatDataHasTitles = (data:DataDownloadListItem[]): boolean => {
    return data.every(obj => {
        return obj.hasOwnProperty('title') && obj.title;
    });
}

export default CheckThatDataHasTitles;
