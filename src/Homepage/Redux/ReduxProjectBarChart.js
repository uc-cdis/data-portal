import { connect } from 'react-redux';
import ProjectBarChart from '../ProjectBarChart';
import { sortCompare } from '../../utils';
import Translator from '../translate';

const tor = Translator.getTranslator();

// Map state.homepage.projectsByName to projectList
const mapStateToProps = (state) => {
  if (state.homepage && state.homepage.projectsByName) {
    const projectList = Object.values(state.homepage.projectsByName)
      .sort(sortCompare)
      .map(
        // Include 'studyCount' attribute for experiment vs study label support hack ...
        (proj) => {
          const res = proj;
          res.studyCount = res.experimentCount;
          res[tor.translate('experimentCount')] = res.experimentCount;
          return res;
        },
      );
    return { projectList };
  }
  return {};
};

// Bar chart does not dispatch anything
const mapDispatchToProps = function mapDispatch() { return {}; };

const ReduxProjectBarChart = connect(mapStateToProps, mapDispatchToProps)(ProjectBarChart);

export default ReduxProjectBarChart;
