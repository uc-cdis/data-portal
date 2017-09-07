import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {CheckBoxGroup} from "../components/CheckBox";
import styled from 'styled-components';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {Sidebar} from "../theme";
import Relay from 'react-relay/classic'

const TableExplorer = ({})=>{
  return(
    <div>
    <div>
        <ReactTable
          data={['data,data,data,data,data']}
          columns={[
            {
              Header: "File Name",
              accessor: "firstName"
            },
            {
              Header: "File Format",
              id: "lastName",
              accessor: d => d.lastName
            },
            {
              Header: "File Size",
              accessor: "age"
            },
            {
              Header: "Status",
              accessor: "status"
            },
            {
              Header: "Visits",
              accessor: "visits"
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
      </div>
    </div>
  )
};

class ExplorerSidebar extends Component {
  static propTypes = {
    projects: PropTypes.object,
    file_formats: PropTypes.array,
  };

  state = {};

  onChangeCheckbox = (group_name, selected_items) =>{
    this.setState({
      ...this.state,
      [group_name]: [selected_items]
    });
  };

  render(){
    return(
      <Sidebar>
      <CheckBoxGroup listItems={Object.values(this.props.projects)} title="Projects"
                group_name="Project" onChange={this.onChangeCheckbox.bind(this)}/>
      <CheckBoxGroup listItems={this.props.file_formats} title="File Formats"
                group_name="file_formats" onChange={this.onChangeCheckbox.bind(this)} />
      </Sidebar>
    );
  };
};

class ExplorerComponent extends Component {
  static propTypes = {
    submission: PropTypes.object,
  };

  aggregateProperties = (dictionary, category, property) =>{
    let aggregateSet = new Set();
    if(dictionary == 'undefined'){
      return(aggregateSet);
    }
    for(let node in dictionary){
      if(dictionary[node].hasOwnProperty('category') && dictionary[node]['category'] == category){
        if(dictionary[node]['properties'][property].hasOwnProperty('enum')){
          for(let property_option of dictionary[node]['properties'][property]['enum']){
            if(!aggregateSet.has(property_option)){
              aggregateSet.add(property_option);
            }
          }
        }
      }
    }
    return(aggregateSet);
  };

  state = {
    projects: this.props.submission.projects,
    selected_projects: null,
    file_formats: this.aggregateProperties(this.props.submission.dictionary, 'data_file', 'data_type'),
    dictionary:this.props.submission.dictionary

  };

  render(){
    return(
      <div>
      <ExplorerSidebar projects={this.state.projects} file_formats={Array.from(this.state.file_formats.values())} />
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
