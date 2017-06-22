import { uploadTSV, submitToServer, updateFileContent } from './submitActions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { button, UploadButton, SubmitButton } from '../theme';
import React, {Component, PropTypes} from 'react';
import Select from 'react-select';

const Required_Notification = styled.span`
  color:#d45252; 
  margin:5px 0 0 0; 
  display:inline;
  float: ${props=>props.istext ? 'right': ''};
`;

const Dropdown = styled(Select)`
  width: 40%;
  float: left;
  margin-right: 1em;
`;

const Input = styled.input`
	width: 220px;
	height:20px;
	padding: 5px 8px;
`;

const Label = styled.label`
	margin: 3px;
    display:inline-block;
    padding:3px;
    width: 220px;

`;

const Input_Description = styled.span`
	font-size: 1rem;
	display:inline-block;
	width: 110px;
	margin-left: 10px;

`;

const SubmitFormButton = styled.button`
  border: 1px solid darkgreen;
  color: darkgreen;
  background-color: white;
  padding: .25em;
  margin-bottom: 1em;
  &:hover,
  &:active,
  &:focus {
    color: #2e842e;
    border-color: #2e842e;

  }
`;

const PropertyInput = ({property, required, description}) =>{
	return(
		<div>
			<Label htmlFor={property}> {property}: </Label>
			<Input type="text" name={property} required={required}/>
			<Required_Notification> {"*"} </Required_Notification>
			<Input_Description>{description}</Input_Description>
		</div>
	)
};

const StyledPropertyInput = styled(PropertyInput)`
	width:500px;
	height: 50px;
`;

const SubmitNodeForm = ({node}) => {
	let requireds = ('required' in node) ? node.required : [];
	let properties = Object.keys(node.properties);

	return(
		<div>
		<h5> Properties: </h5>
		<Required_Notification istext> * Denotes Required Property </Required_Notification>
		<br />
		{properties.map( (property, i) =>
			{
				let description = ('description' in node.properties[property]) ? node.properties[property]['description'] : '';
				let required = (requireds.indexOf(property) > -1)
				return(<StyledPropertyInput key={i} property={property} required={required} description={description}/>)}
		)}
		<SubmitFormButton type="submit"> Submit Form </SubmitFormButton>
		</div>

	)
};



class SubmitFormComponent extends Component {
	static propTypes = {
		node_types: PropTypes.array,
		submission: PropTypes.object,
	}

	state = {
		selectValue:{value: null, label:"" }
	}
	
	render(){

		let dictionary = this.props.submission.dictionary;
		let node_types = this.props.submission.node_types;

		let options = node_types.map( (node_type) => {return {value: node_type, label: node_type}});

		let updateValue = (newValue) =>{
			console.log(this.state.selectValue.value)
			this.setState({
				selectValue: newValue
			});
			console.log(this.state.selectValue.value)
		}
		return(
			<form>
				<SubmitButton> Fill Out Form </SubmitButton>
				<Dropdown name='node_type' options={options} value={this.state.selectValue} onChange={updateValue} />
				{this.state.selectValue.value != null && <SubmitNodeForm node ={dictionary[this.state.selectValue.value]}/>}

			</form>
		)
		
	}

};

const mapStateToProps = (state) => {
	return{
		'submission': state.submission,
	}
};


const matpDispatchToProps = (dispatch) =>{
		return{

		}
};

let SubmitForm = connect(mapStateToProps, matpDispatchToProps)(SubmitFormComponent);

export default SubmitForm;