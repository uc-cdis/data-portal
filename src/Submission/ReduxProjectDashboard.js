import { connect } from 'react-redux';
import { components } from '../params';
import ProjectDashboard from './ProjectDashboard';

const extractData = (summaryCounts) => {
  const summaries = Object.keys(summaryCounts).map((key) => ({
    label: components.charts.boardPluralNames[key],
    value: summaryCounts[key],
  }));
  const details = Object.keys(summaryCounts).map((key) => ({
    label: components.charts.detailPluralNames[key],
    value: summaryCounts[key],
  }));
  return { summaries, details };
};

const ReduxProjectDashboard = (() => {
  const mapStateToProps = (state) => {
    if (state.submission && state.submission.projectsByName) {
      const projectList = Object.values(state.submission.projectsByName);
      const summaryCounts = Object.assign(
        [],
        state.submission.summaryCounts || []
      );
      const extractedData = extractData(summaryCounts);
      return { projectList, ...extractedData };
    }

    return { projectList: [], summaries: [], details: [] };
  };

  // Table does not dispatch anything
  const mapDispatchToProps = null;

  return connect(mapStateToProps, mapDispatchToProps)(ProjectDashboard);
})();

export default ReduxProjectDashboard;
