import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {CheckBoxGroup} from "../components/CheckBox";
import styled from 'styled-components';

const TableExplorer = ({})=>{
  return(
    <div>
    TableExplorer
    </div>
  )
};

class Sidebar extends Component {
  static propTypes = {
    projects: PropTypes.object,
  };

  state = {
    form: {},
  };

  render(){
    return(
      <CheckBox listItems={this.props.projects} title="Projects"
                group_name="Project" onChange={() => alert("checked")}/>
    );
  };
}

class ExplorerComponent extends Component {
  static propTypes = {
    submission: PropTypes.object,
  };

  state = {
    projects: this.props.submission.projects,
  };

  render(){
    return(
      <div>
      <Sidebar projects={this.state.projects} />
      <TableExplorer />
      </div>
    )
  };

}

const mapStateToProps = (state) => {
    return{
      'submission': state.submission,
    }
};


const mapDispatchToProps = (dispatch) =>{
    return{
    }
};

let Explorer = connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);

export default Explorer;