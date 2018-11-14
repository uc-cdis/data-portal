import { connect } from 'react-redux';
import { components } from '../params';
import ProjectDashboard from '../Submission/ProjectDashboard';
import TransactionLogTable from '../components/tables/TransactionLogTable';

const extractData = (summaryCounts) => {
  const summaries = Object.keys(summaryCounts).map(
    key => ({ label: components.charts.boardPluralNames[key], value: summaryCounts[key] }),
  );
  const details = Object.keys(summaryCounts).map(
    key => ({ label: components.charts.detailPluralNames[key], value: summaryCounts[key] }),
  );
  return { summaries, details };
};

export const ReduxProjectDashboard = (() => {
  const mapStateToProps = (state) => {
    if (state.homepage && state.homepage.projectsByName) {
      const projectList = Object.values(state.homepage.projectsByName);
      const summaryCounts = Object.assign([], state.homepage.summaryCounts || []);
      const extractedData = extractData(summaryCounts);
      return { projectList, ...extractedData };
    }

    return { projectList: [], summaries: [], details: [] };
  };

  // Table does not dispatch anything
  const mapDispatchToProps = null;

  return connect(mapStateToProps, mapDispatchToProps)(ProjectDashboard);
})();

export const ReduxTransaction = (() => {
  const mapStateToProps = (state) => {
    if (state.homepage && state.homepage.transactions) {
      return { log: state.homepage.transactions };
    }

    return { log: [] };
  };

  // Table does not dispatch anything
  const mapDispatchToProps = null;

  return connect(mapStateToProps, mapDispatchToProps)(TransactionLogTable);
})();
