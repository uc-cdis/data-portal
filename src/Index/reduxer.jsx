import { connect } from 'react-redux';
import { sortCompare } from '../utils';
import dictIcons from '../img/icons';
import { setActive } from '../Layout/reduxer';
import IndexBarChart from '../components/charts/IndexBarChart/.';
import IndexCounts from '../components/cards/IndexCounts/.';
import IndexButtonBar from '../components/IndexButtonBar';
import { components } from '../params';

export const ReduxIndexBarChart = (() => {
  const mapStateToProps = (state) => {
    if (state.homepage && state.homepage.projectsByName) {
      const projectList = Object.values(
        state.homepage.projectsByName,
      ).sort(sortCompare);
      return {
        projectList,
        countNames: state.homepage.countNames,
      };
    }
    return {};
  };

  // Bar chart does not dispatch anything
  const mapDispatchToProps = function mapDispatch() { return {}; };

  return connect(mapStateToProps, mapDispatchToProps)(IndexBarChart);
})();

export const ReduxIndexCounts = (() => {
  const mapStateToProps = (state) => {
    if (state.homepage && state.homepage.projectsByName) {
      const projectList = Object.values(
        state.homepage.projectsByName,
      ).sort(sortCompare);
      return {
        projectList,
        countNames: state.homepage.countNames,
      };
    }
    return {};
  };

  // Bar chart does not dispatch anything
  const mapDispatchToProps = function mapDispatch() { return {}; };
  return connect(mapStateToProps, mapDispatchToProps)(IndexCounts);
})();

export const ReduxIndexButtonBar = (() => {
  const mapStateToProps = state => ({
    buttons: components.index.buttons,
    dictIcons,
    activeTab: state.bar.active,
  });

  // Bar chart does not dispatch anything
  const mapDispatchToProps = dispatch => ({
    onActiveTab: link => dispatch(setActive(link)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(IndexButtonBar);
})();
