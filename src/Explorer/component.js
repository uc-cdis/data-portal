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
    file_formats: PropTypes.array,
  };

  state = {
    form: {},
  };

  render(){
    return(
      <div>
      <CheckBoxGroup listItems={Object.values(this.props.projects)} title="Projects"
                group_name="Project" onChange={() => alert("checked")}/>
      <CheckBoxGroup listItems={this.props.file_formats} title="File Formats"
                group_name="file_formats" onChange={() => alert("checked")} />
      </div>
    );
  };
}

class ExplorerComponent extends Component {
  static propTypes = {
    submission: PropTypes.object,
  };

  aggregateFileFormats = (dictionary) =>{
    let file_formats = new Set();
    console.log(file_formats)
    if(dictionary == 'undefined'){
      return(file_formats);
    }
    for(let node in dictionary){
      if(dictionary[node].hasOwnProperty('category') && dictionary[node]['category'] == 'data_file'){
        if(dictionary[node]['properties']['data_type'].hasOwnProperty('enum')){
          for(let file_format of dictionary[node]['properties']['data_type']['enum']){
            if(!file_formats.has(file_format)){
              file_formats.add(file_format);
            }
          }
        }
      }
    }
    return(file_formats);
  };

  state = {
    projects: this.props.submission.projects,
<<<<<<< HEAD
  };
=======
    selected_projects: null,
    file_formats: this.aggregateFileFormats(this.props.submission.dictionary),
    dictionary:this.props.submission.dictionary,

  }
>>>>>>> de94a34... feat(explorer): generate list of file_formats


  render(){
    return(
      <div>
      <Sidebar projects={this.state.projects} file_formats={Array.from(this.state.file_formats.values())} />
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
