import { connect } from 'react-redux';
import IndexBarChart from '../components/IndexBarChart';
import { sortCompare } from '../utils';
import { indexChartNames, localTheme } from '../localconf';

// Map state.homepage.projectsByName to projectList
const mapStateToProps = (state) => {
  if (state.homepage && state.homepage.projectsByName) {
    const projectList = Object.values(
      state.homepage.projectsByName,
    ).sort(sortCompare);
    return { projectList, countNames: indexChartNames, localTheme };
  }
  return {};
};

// Bar chart does not dispatch anything
const mapDispatchToProps = function mapDispatch() { return {}; };

const ReduxIndexBarChart = connect(mapStateToProps, mapDispatchToProps)(IndexBarChart);

export default ReduxIndexBarChart;
