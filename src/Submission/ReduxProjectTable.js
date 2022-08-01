import { connect } from 'react-redux';
import { components } from '../params';
import ProjectTable from '../components/tables/ProjectTable';

const ReduxProjectTable = (() => {
  /**  @param {import('../redux/types').RootState} state */
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
  return connect(mapStateToProps)(ProjectTable);
})();

export default ReduxProjectTable;
