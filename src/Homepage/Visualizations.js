import {ResponsiveContainer, Cell, PieChart, Pie, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'Recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import React from 'react';
import {browserHistory} from 'react-router';


const FloatBox = styled.div`
  float: left;
  overflow: hidden;
  width: 70%;
  padding-left: 10%;
`;

/**
 * Component shows stacked-bars - one stacked-bar for each project in props.projectList -
 * where experiments are stacked on top of cases.  projectList looks like:
 * 
 * const data = [
 *       {name: 'bpa-test', experimentCount: 4000, caseCount: 2400, aliquotCount: 2400},
 *       ...
 *   ];
 */
export class StackedBarChart extends React.Component  {
  render() {
    return (
      <FloatBox>    
        <ResponsiveContainer width="100%" height={300}>
          <BarChart onClick={(e) => { browserHistory.push('/'+e.activeLabel); window.location.reload(false);}}  data={this.props.projectList}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <h4>Project Submission status</h4>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Legend />
          <Bar dataKey="caseCount" stackId="a" fill="#8884d8" />
          <Bar dataKey="experimentCount" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
    </FloatBox>
    );
  }
}


const data01 = [{name: 'Unaligned Reads Files', value: 400}, {name: 'Aligned Reads Files', value: 300},
                  {name: 'Sequencing Assays', value: 300}, {name: 'Somatic Mutation Files', value: 200}]

const data02 = [{name: 'A1', value: 100},
                    {name: 'A2', value: 300},
                   {name: 'B1', value: 100},
                   {name: 'B2', value: 80},
                   {name: 'B3', value: 40},
                   {name: 'B4', value: 30},
                   {name: 'B5', value: 50},
                  {name: 'C1', value: 100},
                  {name: 'C2', value: 200},
                   {name: 'D1', value: 150},
                   {name: 'D2', value: 50}]



const TooltipStyle = styled.div`
    background: #82ca9d;
`;


class CustomTooltip extends React.Component {
  render() {
    console.log(this.props);
    const { active } = this.props;
    console.log(active);
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
  type: PropTypes.string,
  payload: PropTypes.array,
  label: PropTypes.string,
};



const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042'];
export const CustomPieChart = () => (
  <PieChart style={{float: 'left'}} width={400} height={300}>
    <Pie startAngle={180} endAngle={0} data={data01} cx={200} cy={200} outerRadius={80} fill="#ffc658" label>
    {
        data01.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
    }
    </Pie>
    <Legend />
    <Tooltip content={<CustomTooltip />} />
  </PieChart>
)
