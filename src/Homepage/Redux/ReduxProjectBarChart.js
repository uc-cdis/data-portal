import { connect } from 'react-redux';
import ProjectBarChart from '../ProjectBarChart';
import { sortCompare } from '../../utils';
import { chartNames, localTheme } from '../../localconf';

// Map state.homepage.projectsByName to projectList
const mapStateToProps = (state) => {
  if (state.homepage && state.homepage.projectsByName) {
    const projectList = Object.values(
      state.homepage.projectsByName,
    ).sort(sortCompare);
    return { projectList, countNames: chartNames, localTheme };
  }
  return {};
};

// Bar chart does not dispatch anything
const mapDispatchToProps = function mapDispatch() { return {}; };

const ReduxProjectBarChart = connect(mapStateToProps, mapDispatchToProps)(ProjectBarChart);

export default ReduxProjectBarChart;
