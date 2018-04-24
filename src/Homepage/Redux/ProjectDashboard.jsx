import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { clearFix } from 'polished';
import ReduxProjectBarChart from './ReduxProjectBarChart';
import CountCard from '../components/CountCard';

const DashTopDiv = styled.div`
  ${clearFix()}
`;

/**
 * Project dashbaord - list projects with various stats and links
 * for submission page.jsx, whatever.
 *   props { caseCount, experimnentCount, fileCount, aliquoteCount, projectList
 *    }
 * where
 *
 *   const projectList = [
 *       {name: 'bpa-test', experiments: 4000, cases: 2400, amt: 2400},
 *       {name: 'ProjectB', experiments: 3000, cases: 1398, amt: 2210},
 *       {name: 'ProjectC', experiments: 2000, cases: 9800, amt: 2290},
 *       {name: 'ProjectD', experiments: 2780, cases: 3908, amt: 2000},
 *       {name: 'ProjectE', experiments: 1890, cases: 4800, amt: 2181},
 *       {name: 'ProjectRye', experiments: 2390, cases: 3800, amt: 2500},
 *
 *   ];
 */
class LittleProjectDashboard extends Component {
  render() {
    return (
      <DashTopDiv>
        <CountCard
          countItems={this.props.summaries}
          icons={this.props.icons}
        />
        {/*<ReduxProjectBarChart projectList={this.props.projectList} />*/}
      </DashTopDiv>
    );
  }
}


LittleProjectDashboard.propTypes = {
  summaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectList: PropTypes.array.isRequired,
  icons: PropTypes.array,
};

LittleProjectDashboard.defaultProps = {
  icons: [],
};

export default LittleProjectDashboard;
