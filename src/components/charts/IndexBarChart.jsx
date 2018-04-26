import { ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import React from 'react';
import { browserHistory } from 'react-router-dom';
import Spinner from '../Spinner';
import TooltipCDIS from './TooltipCDIS';
import Tick from './Tick';


const FloatBox = styled.div`
  float: left;
  overflow: hidden;
  width: 770px;
  min-width: 300px;
  height: 340px;
`;

const sortCount = (a, b) => {
  const countA = a.counts.reduce((res, item) => res + item);
  const countB = b.counts.reduce((res, item) => res + item);
  if (countA === countB) { return 0; }
  return countA < countB ? 1 : -1;
};

/**
 * Component shows stacked-bars - one stacked-bar for each project in props.projectList -
 * where experiments are stacked on top of cases.  projectList looks like:
 *
 * const data = [
 *       {name: 'bpa-test', experimentCount: 4000, caseCount: 2400, aliquotCount: 2400},
 *       ...
 *   ];
 */
class IndexBarChart extends React.Component {
  static propTypes = {
    projectList: PropTypes.arrayOf(
      PropTypes.objectOf(PropTypes.any),
    ),
    countNames: PropTypes.arrayOf(
      PropTypes.string,
    ),
    localTheme: PropTypes.objectOf(
      PropTypes.any,
    ),
  };

  render() {
    const projectList = [...(this.props.projectList.sort(sortCount) || [])];
    if (projectList.length === 0) { return <Spinner />; }
    const localTheme = this.props.localTheme;
    let indexChart = this.props.countNames.map(
      countName => ({ name: countName }),
    );
    const sumList = this.props.countNames.map(() => 0);
    projectList.forEach(
      (project) => {
        project.counts.forEach(
          (count, j) => {
            sumList[j] += count;
          },
        );
      },
    );

    projectList.forEach(
      (project, i) => {
        project.counts.forEach(
          (count, j) => {
            indexChart[j][`count${i}`] = (count / sumList[j]) * 100;
          },
        );
      },
    );

    indexChart = indexChart.map(
      (index, i) => {
        const newIndex = index;
        newIndex.name = `${sumList[i]}#${index.name}`;
        return newIndex;
      },
    );

    const projectNames = projectList.map(project => project.code);
    let barNames = [];
    if (indexChart.length > 0) {
      barNames = Object.keys(indexChart[0]).filter(key => key.indexOf('count') === 0).map(
        name => name,
      );
    }
    let countBar = 0;
    return (
      <FloatBox>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            onClick={(e) => { browserHistory.push(`/${e.activeLabel}`); window.location.reload(false); }}
            data={indexChart}
            margin={{ top: 20, right: 0, left: 250, bottom: 5 }}
            layout="vertical"
          >
            <h4>Project Submission status</h4>
            <XAxis stroke={localTheme['barGraph.lineColor']} fill={localTheme['barGraph.lineColor']} type="number" />
            <YAxis
              dataKey="name"
              tick={<Tick />}
              type="category"
            />
            <Tooltip content={<TooltipCDIS />} />
            <Legend />
            {
              barNames.map(
                (barName, index) => {
                  countBar += 1;
                  return (
                    <Bar
                      key={projectNames[index] + countBar.toString()}
                      name={projectNames[index]}
                      dataKey={barName}
                      stackId="a"
                      fill={localTheme[`barGraph.bar${(index + 1).toString()}Color`]}
                    />
                  );
                },

              )
            }
          </BarChart>
        </ResponsiveContainer>
      </FloatBox>
    );
  }
}


IndexBarChart.defaultProps = {
  projectList: [],
  countNames: [],
  localTheme: {},
};

export default IndexBarChart;
