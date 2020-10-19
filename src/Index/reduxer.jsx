import { connect } from 'react-redux';
import dictIcons from '../img/icons';
import { setActive } from '../Layout/reduxer';
import IndexBarChart from '../components/charts/IndexBarChart/.';
// import IndexCounts from '../components/cards/IndexCounts/.';
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

// export const ReduxIndexCounts = (() => {
//   const mapStateToProps = (state) =>
//     state.index && state.index.projectList
//       ? {
//           projectList: state.index.projectList,
//           countNames: state.index.countNames,
//         }
//       : {};

//   return connect(mapStateToProps)(IndexCounts);
// })();

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
    activeTab: state.bar.active,
    userAccess: state.userAccess.access,
  });

  const mapDispatchToProps = (dispatch) => ({
    onActiveTab: (link) => dispatch(setActive(link)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(IndexButtonBar);
})();

export const ReduxIntroduction = (() => {
  const mapStateToProps = (state) => {
    const resourcePath = '/services/sheepdog/submission/project';
    const isAdminUser =
      state.user.authz &&
      state.user.authz.hasOwnProperty(resourcePath) &&
      state.user.authz[resourcePath][0].method === '*';

    return {
      isAdminUser,
      userAuthMapping: state.userAuthMapping,
    };
  };

  return connect(mapStateToProps)(Introduction);
})();
