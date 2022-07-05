import { connect } from 'react-redux';
import dictIcons from '../img/icons';
import IndexBarChart from '../components/charts/IndexBarChart';
import IndexButtonBar from '../components/IndexButtonBar';
import Introduction from '../components/Introduction';
import IndexOverview from './IndexOverview';
import { components } from '../params';

/** @typedef {import('../redux/types').RootState} RootState */

export const ReduxIndexBarChart = (() => {
  /** @param {RootState} state */
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
  /** @param {RootState} state */
  const mapStateToProps = (state) =>
    state.index && state.index.overviewCounts
      ? { overviewCounts: state.index.overviewCounts }
      : {};

  return connect(mapStateToProps)(IndexOverview);
})();

export const ReduxIndexButtonBar = (() => {
  /** @param {RootState} state */
  const mapStateToProps = (state) => ({
    buttons: components.index.buttons,
    dictIcons,
    userAccess: state.userAccess,
  });

  return connect(mapStateToProps)(IndexButtonBar);
})();

export const ReduxIntroduction = (() => {
  /** @param {RootState} state */
  const mapStateToProps = (state) => {
    const resourcePath = '/services/sheepdog/submission/project';
    return {
      isAdminUser: state.user.authz?.[resourcePath]?.[0].method === '*',
    };
  };

  return connect(mapStateToProps)(Introduction);
})();
