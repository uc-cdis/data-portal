import { connect } from 'react-redux';
import { sortCompare } from '../utils';
import { indexChartNames, localTheme, indexDetails, hostname } from '../localconf';
import dictIcons from '../img/icons';
import { setActive } from '../Top/reduxer';
import IndexBarChart from '../components/charts/IndexBarChart';
import IndexButtonBar from '../components/IndexButtonBar';

export const ReduxIndexBarChart = (() => {
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

  return connect(mapStateToProps, mapDispatchToProps)(IndexBarChart);
})();

export const ReduxIndexButtonBar = (() => {
  const mapStateToProps = state => ({
    hostname,
    buttons: indexDetails.buttons,
    dictIcons,
    activeTab: state.bar.active,
  });

  // Bar chart does not dispatch anything
  const mapDispatchToProps = dispatch => ({
    onActiveTab: link => dispatch(setActive(link)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(IndexButtonBar);
})();
