import { connect } from 'react-redux';
import { sortCompare } from '../utils';
import dictIcons from '../img/icons';
import { setActive } from '../Layout/reduxer';
import IndexBarChart from '../components/charts/IndexBarChart';
import IndexCounts from '../components/cards/IndexCounts';
import IndexButtonBar from '../components/IndexButtonBar';
import Introduction from '../components/Introduction';
import { components } from '../params';

export const ReduxIndexBarChart = (() => {
  const mapStateToProps = (state) => {
    if (state.index && state.index.projectsByName) {
      const projectList = Object.values(
        state.index.projectsByName,
      ).sort(sortCompare);
      return {
        projectList,
        countNames: state.index.countNames,
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
    if (state.index && state.index.projectsByName) {
      const projectList = Object.values(
        state.index.projectsByName,
      ).sort(sortCompare);
      return {
        projectList,
        countNames: state.index.countNames,
      };
    }
    return {};
  };

  // Bar chart does not dispatch anything
  const mapDispatchToProps = function mapDispatch() { return {}; };
  return connect(mapStateToProps, mapDispatchToProps)(IndexCounts);
})();

export const ReduxIndexButtonBar = (() => {
  const mapStateToProps = (state) => ({
    buttons: components.index.buttons,
    dictIcons,
    activeTab: state.bar.active,
    userAccess: state.userAccess.access,
  });

  // Bar chart does not dispatch anything
  const mapDispatchToProps = (dispatch) => ({
    onActiveTab: (link) => dispatch(setActive(link)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(IndexButtonBar);
})();

export const ReduxIntroduction = (() => {
  const mapStateToProps = (state) => ({
    userAuthMapping: state.userAuthMapping,
  });

  return connect(mapStateToProps)(Introduction);
})();
