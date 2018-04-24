import { ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import React from 'react';
import { browserHistory } from 'react-router-dom';


const FloatBox = styled.div`
  float: left;
  overflow: hidden;
  width: 770px;
  min-width: 300px;
  height: 340px;
`;

const sortCount = (a, b) => {
  let countA = a.counts.reduce((res, item) => {return res + item});
  let countB = b.counts.reduce((res, item) => {return res + item});
  if (countA === countB) { return 0; }
  return countA < countB ? 1 : -1;
};

class Tick extends React.Component {
  render() {
    const { x, y, payload } = this.props;
    const texts = payload.value.split('#');
    return (
      <g>
        <text textAnchor="end" x={x} y={y} dy={0}>
          <tspan className='special-number' fill='#3283C8'>{`${texts[0]} `}</tspan>
          <tspan className='h4-typo'>{`${texts[1]}`}</tspan>
        </text>
      </g>
    );
  }
}


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
    const localTheme = this.props.localTheme;
    const indexChart = this.props.countNames.map(
      (countName) => {
        return { name: countName }
      }
    );
    let sumList = this.props.countNames.map( () => 0);
    projectList.forEach(
      (project, i) => {
        project.counts.forEach(
          (count, j) => {
            sumList[j] += count;
          }
        )
      }
    );

    projectList.forEach(
      (project, i) => {
        project.counts.forEach(
          (count, j) => {
            indexChart[j][`count${i}`] = (count / sumList[j]) * 100;
          }
        )
      }
    );

    indexChart.forEach(
      (index, i) => {
        index.name = `${sumList[i]}#${index.name}`;
      }
    );

    let projectNames = projectList.map( (project) => { return project.code });
    console.log(projectList);
    console.log('Index charts');
    console.log(indexChart);
    let barNames = [];
    if (indexChart.length > 0) {
      barNames = Object.keys(indexChart[0]).filter(key => key.indexOf('count') === 0).map(
        name => name,
      );
    }
    console.log('Bar names');
    console.log(barNames);
    console.log('Count names');
    console.log(projectNames);
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
            <XAxis stroke={localTheme['barGraph.lineColor']} fill={localTheme['barGraph.lineColor']}  type='number'/>
            <YAxis dataKey="name"
                   tick={<Tick />}
                   type='category'
            />
            <Tooltip />
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
