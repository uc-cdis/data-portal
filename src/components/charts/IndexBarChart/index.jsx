import {
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import Spinner from '../../Spinner';
import TooltipCDIS from '../TooltipCDIS';
import Tick from '../Tick';
import './IndexBarChart.css';
import { getCategoryColor } from '../helper';
import { components } from '../../../params';

const showPercentage = components.index?.barChart?.showPercentage;
const sortCount = (a, b) => {
  const countA = a.counts.reduce((res, item) => res + item);
  const countB = b.counts.reduce((res, item) => res + item);
  if (countA === countB) {
    return 0;
  }
  return countA < countB ? 1 : -1;
};

const getTopList = (projectList) => {
  const topList = projectList.slice(0, 4);
  const others = projectList.slice(4, projectList.length);
  const other = others.reduce((data, item) => {
    const res = { ...data };
    res.counts = data.counts.map((count, idx) => count + item.counts[idx]);
    return res;
  });
  other.code = 'others';
  topList.push(other);
  return topList;
};

const computeSummations = (projectList, countNames) => {
  const sumList = countNames.map(() => 0);
  projectList.forEach((project) => {
    project.counts.forEach((count, j) => {
      sumList[j] += count;
    });
  });
  return sumList;
};

const createChartData = (projectList, countNames, sumList) => {
  let indexChart = countNames.map((countName) => ({
    name: countName,
    allCounts: [],
  }));
  projectList.forEach((project, i) => {
    project.counts.forEach((count, j) => {
      if (typeof indexChart[j] === 'undefined') return;
      indexChart[j].allCounts.push(count);
      indexChart[j][`count${i}`] = getChartCount(count, sumList[j]);
    });
  });

  indexChart = indexChart.map((index, i) => {
    const newIndex = index;
    newIndex.name = `${sumList[i]}#${index.name}`;
    return newIndex;
  });
  return indexChart;
};

const getChartCount = (count, sum) => {
  if (showPercentage) {
    return sum > 0 ? ((count * 100) / sum).toFixed(2) : 0;
  }
  return sum > 0 ? count : 0;
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
function IndexBarChart({ projectList, countNames, barChartStyle, xAxisStyle }) {
  if (projectList.length === 0)
    return (
      <div className='index-bar-chart'>
        <Spinner />
      </div>
    );

  const sortedProjectList = [...projectList].sort(sortCount);
  const topList =
    sortedProjectList.length <= 5
      ? sortedProjectList
      : getTopList(sortedProjectList);
  const sumList = computeSummations(topList, countNames);
  const indexChart = createChartData(topList, countNames, sumList);
  const projectNames = topList.map((project) => project.code);
  const barNames = Object.keys(indexChart[0] ?? {}).filter((key) =>
    key.startsWith('count')
  );

  let countBar = 0;
  return (
    <div className='index-bar-chart'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={indexChart}
          margin={barChartStyle.margins}
          layout={barChartStyle.layout}
        >
          <XAxis
            {...xAxisStyle}
            stroke={xAxisStyle.color}
            fill={xAxisStyle.color}
            type='number'
          />
          <YAxis
            dataKey='name'
            tick={<Tick />}
            type='category'
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TooltipCDIS />} />
          <Legend />
          {barNames.map((barName, index) => {
            countBar += 1;
            return (
              <Bar
                key={projectNames[index] + countBar.toString()}
                name={projectNames[index]}
                dataKey={barName}
                stackId='a'
                fill={getCategoryColor(index)}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

IndexBarChart.propTypes = {
  projectList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  countNames: PropTypes.arrayOf(PropTypes.string),
  xAxisStyle: PropTypes.object,
  barChartStyle: PropTypes.object,
};

IndexBarChart.defaultProps = {
  projectList: [],
  countNames: [],
  xAxisStyle: {
    color: '#666666',
    domain: showPercentage ? [0, 100] : [],
    ticks: showPercentage ? [0, 25, 50, 75, 100] : [],
    allowDecimals: false,
    unit: showPercentage ? '%' : '',
  },
  barChartStyle: {
    margins: {
      top: 20,
      right: 20,
      left: 160,
      bottom: 5,
    },
    layout: 'vertical',
  },
};

export default IndexBarChart;
