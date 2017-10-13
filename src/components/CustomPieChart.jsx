import { ResponsiveContainer, Cell, PieChart, Pie, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import React from 'react';


const data01 = [
  { name: 'Unaligned Reads Files', value: 400 },
  { name: 'Aligned Reads Files', value: 300 },
  { name: 'Sequencing Assays', value: 300 },
  { name: 'Somatic Mutation Files', value: 200 },
];


const TooltipStyle = styled.div`
    background: #82ca9d;
`;


class CustomTooltip extends React.Component {
  render() {
    const { active } = this.props;
    if (active) {
      const { payload, label } = this.props;
      return (
        <TooltipStyle>
          <p className="label">{payload[0].payload.name}</p>
        </TooltipStyle>
      );
    }

    return null;
  }
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.string,
};


const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042'];
const CustomPieChart = function () {
  return (
    <PieChart style={{ float: 'left' }} width={400} height={300}>
      <Pie startAngle={180} endAngle={0} data={data01} cx={200} cy={200} outerRadius={80} fill="#ffc658" label>
        {
          data01.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} />)
        }
      </Pie>
      <Legend />
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );
};

export default CustomPieChart;
