import ListItem from './ListItem';

const CheckThatDataHasTitles = (data:ListItem[]): boolean => {
    return data.every(obj => {
        return obj.hasOwnProperty('title') && obj.title;
    });
}

export default CheckThatDataHasTitles;
