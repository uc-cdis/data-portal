import { connect } from 'react-redux'
import { ProjectBarChart } from './ProjectBarChart.jsx';


// Map state.homepage.projectsByName to projectList 
const mapStateToProps = (state)=> {
  if ( state.homepage && state.homepage.projectsByName ) {
    const projectList = Object.values( state.homepage.projectsByName ).sort( (a,b) => a<b?-1:a===b?0:1 );
    return { projectList };
  } else {
    return {};
  }
};

// Bar chart does not dispatch anything
const mapDispatchToProps = (dispatch) => ({
});

const ReduxProjectBarChart = connect(mapStateToProps, mapDispatchToProps)(ProjectBarChart);

export default ReduxProjectBarChart;