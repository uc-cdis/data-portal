import { connect } from 'react-redux';
import { ProjectBarChart } from './ProjectBarChart';


// Map state.homepage.projectsByName to projectList 
const mapStateToProps = (state) => {
  if (state.homepage && state.homepage.projectsByName) {
    const projectList = Object.values(state.homepage.projectsByName).sort((a, b) => (a < b ? -1 : a === b ? 0 : 1)).map(
      // Include 'studyCount' attribute for experiment vs study label support hack ...
      (proj) => {
        proj.studyCount = proj.experimentCount;
        return proj;
      },
    );
    return { projectList };
  }
  return {};
};

// Bar chart does not dispatch anything
const mapDispatchToProps = dispatch => ({
});

const ReduxProjectBarChart = connect(mapStateToProps, mapDispatchToProps)(ProjectBarChart);

export default ReduxProjectBarChart;
