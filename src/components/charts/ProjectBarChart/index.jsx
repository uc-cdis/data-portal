import { ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import React from 'react';
import { browserHistory } from 'react-router-dom';
import './ProjectBarChart.less'

/**
 * Component shows stacked-bars - one stacked-bar for each project in props.projectList -
 * where experiments are stacked on top of cases.  projectList looks like:
 *
 * const data = [
 *       {name: 'bpa-test', experimentCount: 4000, caseCount: 2400, aliquotCount: 2400},
 *       ...
 *   ];
 */
class ProjectBarChart extends React.Component {
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
    const projectList = [...(this.props.projectList || [])];
    const countNames = this.props.countNames;
    const localTheme = this.props.localTheme;
    const projectCharts = projectList.map(
      (project) => {
        const dict = { name: project.name };
        Object.keys(project.charts).forEach(
          (key) => { dict[`chart${key.toString()}`] = project.charts[key]; },
        );
        return dict;
      },
    );
    let barNames = [];
    if (projectCharts.length > 0) {
      barNames = Object.keys(projectCharts[0]).filter(key => key.indexOf('chart') === 0).map(
        name => name,
      );
    }
    let countBar = 0;
    return (
      <div className="project-bar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            onClick={(e) => { browserHistory.push(`/${e.activeLabel}`); window.location.reload(false); }}
            data={projectCharts}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barSize={projectCharts.length < 10 ? 50 : null}
            layout='horizontal'
          >
            <h4>Project Submission status</h4>
            <XAxis dataKey='name' stroke={localTheme['barGraph.lineColor']} fill={localTheme['barGraph.lineColor']} />
            <YAxis stroke={localTheme['barGraph.lineColor']} fill={localTheme['barGraph.lineColor']} />
            <Tooltip />
            <Legend />
            {
              barNames.map(
                (barName, index) => {
                  countBar += 1;
                  return (
                    <Bar
                      key={countNames[index] + countBar.toString()}
                      name={countNames[index]}
                      dataKey={barName}
                      stackId='a'
                      fill={localTheme[`barGraph.bar${(index + 1).toString()}Color`]}
                    />
                  );
                },

              )
            }
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}


ProjectBarChart.defaultProps = {
  projectList: [],
  countNames: [],
  localTheme: {},
};

export default ProjectBarChart;
