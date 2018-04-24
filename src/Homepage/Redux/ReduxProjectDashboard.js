import { connect } from 'react-redux';
import { DashboardWith } from '../components/ParamProjectDashboard';
import ProjectTable from '../components/ProjectTable';


// Map state.homepage.projectsByName to projectList
const mapStateToProps = (state) => {
  if (state.homepage && state.homepage.projectsByName) {
    const projectList = Object.values(state.homepage.projectsByName);
    const summaryCounts = Object.assign([], state.homepage.summaryCounts || []);
    return { projectList, summaryCounts };
  }
  return {};
};

// Table does not dispatch anything
const mapDispatchToProps = function () { return {}; };

export const ReduxProjectTable = connect(mapStateToProps, mapDispatchToProps)(ProjectTable);
const DashboardWithReduxTable = DashboardWith(ReduxProjectTable);
const ReduxProjectDashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardWithReduxTable);

export default ReduxProjectDashboard;
