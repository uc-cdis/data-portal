import { ResponsiveContainer, Cell, PieChart, Pie, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import React from 'react';
import { browserHistory } from 'react-router';
import Translator from './translate';


const tor = Translator.getTranslator();


const FloatBox = styled.div`
  float: left;
  overflow: hidden;
  width: 70%;
  min-width: 300px;
  height: 340px;
`;

// ${props => 100 + 50*props.projectList.length}px;

/**
 * Component shows stacked-bars - one stacked-bar for each project in props.projectList -
 * where experiments are stacked on top of cases.  projectList looks like:
 * 
 * const data = [
 *       {name: 'bpa-test', experimentCount: 4000, caseCount: 2400, aliquotCount: 2400},
 *       ...
 *   ];
 */
export class ProjectBarChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const projectList = [].concat(this.props.projectList || []);

    return (
      <FloatBox>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            onClick={(e) => { browserHistory.push(`/${e.activeLabel}`); window.location.reload(false); }}
            data={projectList}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barSize={projectList.length < 10 ? 50 : null}
            layout="horizontal"
          >
            <h4>Project Submission status</h4>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="caseCount" stackId="a" fill="#8884d8" />
            <Bar dataKey={tor.translate('experimentCount')} stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </FloatBox>
    );
  }
}

