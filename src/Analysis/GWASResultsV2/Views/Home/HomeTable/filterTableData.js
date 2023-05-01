import moment from 'moment';

const filterBySearchTerm = (initData, key, searchTerm) =>
  initData.filter((obj) =>
    obj[key]
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

const filterByJobStatuses = (initData, jobStatusSelections) =>
  initData.filter((item) => jobStatusSelections.includes(item.phase));

const filterByDateRange = (initData, key, dateSelection) =>
  initData.filter((obj) => {
    const utcDate = moment.utc(obj[key]);
    return (
      utcDate.isSameOrAfter(dateSelection[0]) &&
      utcDate.isSameOrBefore(dateSelection[1])
    );
  });

const filterTableData = (data, homeTableState) => {
  let filteredDataResult = data;
  if (homeTableState.nameSearchTerm.length > 0) {
    filteredDataResult = filterBySearchTerm(
      filteredDataResult,
      'name',
      homeTableState.nameSearchTerm
    );
  }
  if (homeTableState.wfNameSearchTerm.length > 0) {
    filteredDataResult = filterBySearchTerm(
      filteredDataResult,
      'wf_name',
      homeTableState.wfNameSearchTerm
    );
  }
  if (homeTableState.submittedAtSelections.length > 0) {
    filteredDataResult = filterByDateRange(
      filteredDataResult,
      'submittedAt',
      homeTableState.submittedAtSelections
    );
  }
  if (homeTableState.jobStatusSelections.length > 0) {
    filteredDataResult = filterByJobStatuses(
      filteredDataResult,
      homeTableState.jobStatusSelections
    );
  }
  if (homeTableState.finishedAtSelections.length > 0) {
    filteredDataResult = filterByDateRange(
      filteredDataResult,
      'finishedAt',
      homeTableState.finishedAtSelections
    );
  }
  return filteredDataResult;
};

export default filterTableData;
