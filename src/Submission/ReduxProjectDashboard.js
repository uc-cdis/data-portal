import { connect } from 'react-redux';
import { components } from '../params';
import ProjectDashboard from './ProjectDashboard';

const ReduxProjectDashboard = (() => {
  const mapStateToProps = (state) =>
    state.submission?.projectsByName !== undefined
      ? {
          projectList: Object.values(state.submission.projectsByName),
          summaryFields: Object.keys(state.submission.summaryCounts).map(
            (key) => components.charts.boardPluralNames[key]
          ),
        }
      : {
          projectList: [],
          summaryFields: [],
        };
  return connect(mapStateToProps)(ProjectDashboard);
})();

export default ReduxProjectDashboard;
