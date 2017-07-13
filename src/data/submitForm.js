import { uploadTSV, submitToServer, updateFileContent } from './submitActions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { button, UploadButton, SubmitButton, Required_Notification, Dropdown, Input, Label } from '../theme';
import React, {Component, PropTypes} from 'react';
import {json_to_string} from './utils.js';


const Input_Description = styled.span`
	font-size: 1rem;
	display:inline-block;
	width: 750px;
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

const AnyOfSubProps = styled.div`
	margin-left:50px;
`;

const TextInput = ({name, required, description, onChange}) =>{
	return(
		<div>
			<Label htmlFor={name}> {name}: </Label>
			{description != '' && <Input_Description>{description}</Input_Description>}
			<br />
			<Input type="text" name={name} required={required} onChange={onChange}/>
			{required && <Required_Notification> {"*"} </Required_Notification>}
			
		</div>
	)
};

const StyledTextInput = styled(TextInput)`
	width:500px;
	height: 50px;
`;

class EnumInput extends Component {

	static propTypes = {
		name: PropTypes.string,
		options: PropTypes.array,
		required: PropTypes.bool,
		description: PropTypes.string,
		onChange: PropTypes.func,
	}

	state = {
		chosenEnum: ''
	}
	render(){
		let options = this.props.options.map( (option, i) => ({label:option, value:option}) );
		
		let onChangeEnumWrapper = (newValue) =>{
			this.setState({
				chosenEnum:newValue
			});
			this.props.onChange(this.props.name, newValue);
		};
	
		return(
			<div>
				<Label htmlFor={this.props.name}> {this.props.name}: </Label>
				{this.props.description != '' && <Input_Description>{this.props.description}</Input_Description>}
				<br />
				<Dropdown name={this.props.name} options={options} value={this.state.chosenEnum} onChange={onChangeEnumWrapper} />
				{this.props.required && <Required_Notification> {"*"} </Required_Notification>}
				<br/> 
			</div>
	
		)}};

class OneOfInput extends Component {
	//couldn't make a generalized component as I would like to, so I am shortcircuiting the logic

	static propTypes = {
		property: PropTypes.any,
		name: PropTypes.string,
		value: PropTypes.string,
		required: PropTypes.bool,
		description: PropTypes.string,
		onChange: PropTypes.func,
		onChangeEnum: PropTypes.func
	}

	state = {
		selectedOption: 'Text'
	}



	render(){
		let radioChange = (newValue) =>{
			this.setState({
				selectedOption: newValue.target.value
			});
		};

		if(this.props.property[0].hasOwnProperty('enum') && this.props.property[1].hasOwnProperty('enum')){
			let options = this.props.property[0].enum.concat(this.props.property[1].enum);
			return(
				<EnumInput 
				name={this.props.name}
				options={options}
				required={this.props.required}
				description={this.props.description}
				onChange={this.props.onChangeEnum}/>
			)
		} else if(this.props.property[0].type == 'string' && this.props.property[1].type == 'null'){
			return(
				<StyledTextInput name={this.props.name} required={this.props.required} description={this.props.description} onChange={this.props.onChange} />
			)
		}else{
			return(
				<div>
				What is your data type for {this.props.name}?
				<br />
					<label>
						<input type="radio" value="Text" checked={this.state.selectedOption == 'Text'} onChange={radioChange} />
						Text
					</label>

					<label>
						<input type="radio" value="Number" checked={this.state.selectedOption == 'Number'} onChange={radioChange} />
						Number
					</label>
				{this.state.selectedOption == 'Number' && 
				<StyledTextInput 
				name={this.props.name} 
				description={this.props.description} 
				required={this.props.required}
				onChange={this.props.onChange}  />
				}
				{this.state.selectedOption == 'Text' && 
				<EnumInput 
				name={this.props.name} 
				options={this.props.property[0].enum} 
				required={this.props.required}
				description={this.props.description}
				onChange={this.props.onChangeEnum} />
				}
				
				</div>

			)}}
};

const AnyOfInput =({name, node,properties, requireds, onChange}) =>{
	//this is smelly code because it reuses logic from SubmitNodeForm, 
	//I'd like to extract some of the code into another function

	let onChangeAnyOfWrapper = (event) =>{
  		onChange(name, event,properties)
	};

	return(
	<div>
	<h6>{name}:</h6>
	<AnyOfSubProps>
	{properties.map( (property, i)=> {
		let description = ('description' in node.properties[property]) ? node.properties[property]['description'] : '';
		if (description == ''){
            description = ('term' in node.properties[property]) ? node.properties[property]['term']['description'] : '';
               }
        let required = (requireds.indexOf(property) > -1);
		
		return(
			<StyledTextInput key={i} name={property} required={required} description={description} onChange={onChangeAnyOfWrapper}/>)
	})}
	</AnyOfSubProps>
	</div>
)};

const SubmitNodeForm = ({node, properties, requireds, onChange, onChangeEnum, onChangeAnyOf, handleSubmit}) => {
	
	return(
		<div>
		<form onSubmit={handleSubmit} >
		{properties.map( (property, i) => {
				let description = ('description' in node.properties[property]) ? node.properties[property]['description'] : '';
				if (description == ''){
                   description = ('term' in node.properties[property]) ? node.properties[property]['term']['description'] : '';
               }
               let required = (requireds.indexOf(property) > -1);

               if(property == 'type'){
               		return
               }else if('enum' in node.properties[property]){
               	return(
               		<EnumInput key={i} 
               		name={property} 
               		options={node.properties[property]['enum']} 
               		onChange={onChangeEnum} 
               		required={required} 
               		description={description} />)
               } else if('oneOf' in node.properties[property]){
               	return(
               		<OneOfInput
               		key={i} 
               		property={node.properties[property]['oneOf']}
               		name={property}
               		value={property}
               		required={required}
               		description={description}
               		onChange={onChange}
               		onChangeEnum={onChangeEnum} />)
               }else if('anyOf' in node.properties[property]){
               	return(
               		<AnyOfInput
               		key={i}
               		name={property} 
               		node={node.properties[property].anyOf[0].items}
               		properties={Object.keys(node.properties[property].anyOf[0].items.properties)}
               		requireds={requireds}
               		onChange={onChangeAnyOf} /> 
               	)
               }else{
               	  return(<StyledTextInput key={i} name={property} required={required} description={description} onChange={onChange}/>)}
		})}
		<SubmitFormButton type="submit" value="Submit"> Upload Form to Submit </SubmitFormButton>
		</form>
		</div>

	)
};



class SubmitFormContainer extends Component {
	static propTypes = {
		node_types: PropTypes.array,
		submission: PropTypes.object,
		onUploadClick: PropTypes.func,
		onSubmitClick: PropTypes.func,
	}

	state = {
		chosenNode:{value: null, label:""},
	}

	handleSubmit = (event) => {
		event.preventDefault();

		const objectWithoutKey = (object, key) => {
  			const {[key]: deletedKey, ...otherKeys} = object;
  			return otherKeys;
		}

		let value = objectWithoutKey(this.state, 'chosenNode');
		value = json_to_string(value);
		this.props.onUploadClick(value, 'application/json');
		
  	}

  	onChangeAnyOf = (name, event, properties) =>{
  		const target = event.target;
  		const value = target.type === 'checkbox' ? target.checked : target.value;
  		const subname = target.name;

  		if(this.state[name] == null){
  			this.setState({
  				[name]: [{[subname]: value}]
  			});
  		}else if(properties.every(prop => prop in this.state[name])){
  			this.setState({
  				[name]: this.state[name].push({[subname]: value})
  			});
  		}else{
  			this.setState({
  				[name]: [...this.state[name].slice(0,this.state[name].length-2),
  					{...this.state[name][this.state[name].length-1], [subname]: value}]
  			});
  		}
  	};

  	onChange = (event) =>{
  		const target = event.target;
  		const value = target.type === 'checkbox' ? target.checked : target.value;
  		const name = target.name;
  		this.setState({
  			[name]: value
  		});
	};

	onChangeEnum = (name, newValue) =>{
		this.setState({
			[name]: newValue.value
		});
	};

	render(){
		let dictionary = this.props.submission.dictionary;
		let node_types = this.props.submission.node_types;
		let node = dictionary[this.state.chosenNode.value];
		let options = node_types.map( (node_type) => {return {value: node_type, label: node_type}});

		let updateChosenNode = (newValue) =>{
			this.setState({
				chosenNode: newValue,
				type: newValue.value,
			});
		};


		return(
			<div>
			<form>
				<h5> Fill Out Form: </h5>
				<Dropdown name='node_type' options={options} value={this.state.chosenNode} onChange={updateChosenNode} />
			</form>
			{(this.state.chosenNode.value != null) &&
			<div>
			   <h5> Properties: </h5>
			   <Required_Notification istext> * Denotes Required Property </Required_Notification>
			   <br />
			   <SubmitNodeForm 
			   node={node}   
			   properties={Object.keys(node.properties).filter((prop) => node.systemProperties.indexOf(prop)<0)}
			   requireds={('required' in node) ? node.required : []}
			   onChange={this.onChange.bind(this)}
			   onChangeEnum={this.onChangeEnum.bind(this)}
			   onChangeAnyOf={this.onChangeAnyOf.bind(this)}
			   handleSubmit={this.handleSubmit.bind(this)} />
			</div>
			}
			</div>
			
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
			onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
		}
};

let SubmitForm = connect(mapStateToProps, matpDispatchToProps)(SubmitFormContainer);

export default SubmitForm;