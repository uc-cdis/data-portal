import { connect } from 'react-redux';
import { ProjectBarChart } from './ProjectBarChart';
import { sortCompare } from '../utils';
import Translator from './translate';

const tor = Translator.getTranslator();

// Map state.homepage.projectsByName to projectList 
const mapStateToProps = (state) => {
  if (state.homepage && state.homepage.projectsByName) {
    const projectList = Object.values(state.homepage.projectsByName)
      .sort(sortCompare)
      .map(
        // Include 'studyCount' attribute for experiment vs study label support hack ...
        (proj) => {
          proj.studyCount = proj.experimentCount;
          proj[tor.translate('experimentCount')] = proj.experimentCount;
          return proj;
        },
      );
    return { projectList };
  }
  return {};
};

// Bar chart does not dispatch anything
const mapDispatchToProps = function () { return {}; };

const ReduxProjectBarChart = connect(mapStateToProps, mapDispatchToProps)(ProjectBarChart);

export default ReduxProjectBarChart;
