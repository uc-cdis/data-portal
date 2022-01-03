import { connect } from 'react-redux';
import dictIcons from '../img/icons';
import IndexBarChart from '../components/charts/IndexBarChart';
import IndexButtonBar from '../components/IndexButtonBar';
import Introduction from '../components/Introduction';
import IndexOverview from './IndexOverview';
import { components } from '../params';

export const ReduxIndexBarChart = (() => {
  const mapStateToProps = (state) =>
    state.index && state.index.projectList
      ? {
          projectList: state.index.projectList,
          countNames: state.index.countNames,
        }
      : {};

  return connect(mapStateToProps)(IndexBarChart);
})();

export const ReduxIndexOverview = (() => {
  const mapStateToProps = (state) =>
    state.index && state.index.overviewCounts
      ? { overviewCounts: state.index.overviewCounts }
      : {};

  return connect(mapStateToProps)(IndexOverview);
})();

export const ReduxIndexButtonBar = (() => {
  const mapStateToProps = (state) => ({
    buttons: components.index.buttons,
    dictIcons,
    userAccess: state.userAccess.access,
  });

  return connect(mapStateToProps)(IndexButtonBar);
})();

export const ReduxIntroduction = (() => {
  const mapStateToProps = (state) => {
    const resourcePath = '/services/sheepdog/submission/project';
    return {
      isAdminUser: state.user.authz?.[resourcePath]?.[0].method === '*',
    };
  };

  return connect(mapStateToProps)(Introduction);
})();
