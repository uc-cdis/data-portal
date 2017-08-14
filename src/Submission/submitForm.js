import { uploadTSV, submitToServer, updateFileContent } from './actions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { button, UploadButton, SubmitButton, Required_Notification, Dropdown, Input, Label } from '../theme';
import React, {Component, PropTypes} from 'react';
import {json_to_string} from '../utils.js';
import {Toggle} from 'material-ui';


const Input_Description = styled.span`
	font-size: 1rem;
	display:inline-block;
	width: 750px;
`;


const UploadFormButton = styled.button`
  border: 1px solid darkgreen;
  display:inline-block;
  color: darkgreen;
  margin: 1em 0em;
  &:hover,
  &:active,
  &:focus {
    color: #2e842e;
    border-color: #2e842e;
  }
  border-radius: 3px;
  padding: 0px 8px;
  cursor: pointer;
  line-height: 2em;
  font-size: 1em;
  margin-right: 1em;
  background-color:white;
`;

const AnyOfSubProps = styled.div`
	margin-left:50px;
`;

const TextInput = ({name, value, required, description, onChange}) =>{
	return(
		<div>
			<Label htmlFor={name}> {name}: </Label>
			{description != '' && <Input_Description>{description}</Input_Description>}
			<br />
			<Input type="text" name={name} value={value ? value:""} required={required} onChange={onChange}/>
			{required && <Required_Notification> {"*"} </Required_Notification>}	
		</div>
	)
};

class EnumInput extends Component {

	static propTypes = {
		name: PropTypes.string,
		options: PropTypes.array,
		required: PropTypes.bool,
		description: PropTypes.string,
		onChange: PropTypes.func,
	};

	state = {
		chosenEnum: ''
	};
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
				<Dropdown name={this.props.name} options={options} required={this.props.required} value={this.state.chosenEnum} onChange={onChangeEnumWrapper} />
				{this.props.required && <Required_Notification> {"*"} </Required_Notification>}
				<br/> 
			</div>
    )
  }
}

class OneOfInput extends Component {
	//couldn't make a generalized component as I would like to, so I am shortcircuiting the logic

	static propTypes = {
		property: PropTypes.any,
		value: PropTypes.any,
		name: PropTypes.string,
		value: PropTypes.string,
		required: PropTypes.bool,
		description: PropTypes.string,
		onChange: PropTypes.func,
		onChangeEnum: PropTypes.func
	};

	state = {
		selectedOption: 'Text'
	};

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
				<TextInput name={this.props.name} value={this.props.value} required={this.props.required} description={this.props.description} onChange={this.props.onChange} />
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
				<TextInput 
				name={this.props.name}
				value={this.props.value} 
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
}

const AnyOfInput =({name, values, node, properties, required, requireds, onChange}) =>{
	//this is smelly code because it reuses logic from SubmitNodeForm, 
	//I'd like to extract some of the code into another function

	let onChangeAnyOfWrapper = (event) =>{
  		onChange(name, event,properties)
	};

	return(
	<div>
	<h6 style={{display:'inline'}}>{name}:</h6>
  {required && <Required_Notification> {"*"} </Required_Notification>}
	<AnyOfSubProps>
	{properties.map( (property, i)=> {
		let description = ('description' in node.properties[property]) ? node.properties[property]['description'] : '';
		if (description == ''){
            description = ('term' in node.properties[property]) ? node.properties[property]['term']['description'] : '';
               }
        let required_subprop = (requireds.indexOf(property) > -1);
		//we use index 0 of values because AnyOfInput is hardcoded to be an array of length 1, an upcoming feature should be to add to this array
		return(
			<TextInput key={i} name={property} value={values ? values[0][property]: ""} required={required && required_subprop} description={description} onChange={onChangeAnyOfWrapper}/>)
	})}
	</AnyOfSubProps>
	</div>
)};

const SubmitNodeForm = ({node,form, properties, requireds, onChange, onChangeEnum, onChangeAnyOf, handleSubmit}) => {
	
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

               }else if('enum' in node.properties[property]){
               	return(
               		<EnumInput key={i} 
               		name={property} 
               		options={node.properties[property]['enum']} 
               		onChange={onChangeEnum} 
               		required={required} 
               		description={description}/>)
               } else if('oneOf' in node.properties[property]){
               	return(
               		<OneOfInput
               		key={i}
               		value={form[property]} 
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
               		values={form[property]}
               		name={property} 
               		node={node.properties[property].anyOf[0].items}
               		properties={Object.keys(node.properties[property].anyOf[0].items.properties)}
                  required={required}
               		requireds={requireds}
               		onChange={onChangeAnyOf} /> 
               	)
               }else{
               	  return(<TextInput key={i} name={property} value={form[property]} required={required} description={description} onChange={onChange}/>)}
		})}
		<UploadFormButton type="submit" value="Submit"> Upload submission json from form </UploadFormButton>
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
	};

	state = {
		chosenNode:{value: null, label:""},
		fill_form:false,
		form: {}
	};
	onFormToggle = () =>{
		this.setState({
			'fill_form': !(this.state.fill_form)
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();

		const objectWithoutKey = (object, key) => {
  			const {[key]: deletedKey, ...otherKeys} = object;
  			return otherKeys;
		};

		let value = json_to_string(this.state.form);
		this.props.onUploadClick(value, 'application/json');
  	};

  	onChangeAnyOf = (name, event, properties) =>{
  		const target = event.target;
  		const value = target.type === 'checkbox' ? target.checked : target.value;
  		const subname = target.name;

  		if(this.state.form[name] === null){
  			this.setState({
  				form:{...this.state.form,
  			  		[name]: [{[subname]: value}]
  			  	}
  			});
  		}else if(properties.every(prop => prop in this.state.form[name])){
  			this.setState({
  				form:{...this.state.form,
  			  		[name]: this.state.form[name].push({[subname]: value})
  			  	}});
  		}else{
  			this.setState({
  				form:{...this.state.form,
  			  		[name]: [...this.state.form[name].slice(0,this.state.form[name].length-2),
  			  		{...this.state.form[name][this.state.form[name].length-1], [subname]: value}]
  			  	}});
  		}
  	};

  	onChange = (event) =>{
  		const target = event.target;
  		const value = target.type === 'checkbox' ? target.checked : target.value;
  		const name = target.name;
  		this.setState({
  			form:{...this.state.form, 
  		  			[name]: value
  		  		}});
	};

	onChangeEnum = (name, newValue) =>{
		this.setState({
			form:{...this.state.form,
					[name]: newValue.value
				}});
	};

	render(){
		let dictionary = this.props.submission.dictionary;
		let node_types = this.props.submission.node_types;
		let node = dictionary[this.state.chosenNode.value];
		let options = node_types.map( (node_type) => {return {value: node_type, label: node_type}});

		let updateChosenNode = (newValue) =>{
			this.setState({
				chosenNode: newValue,
				form:{
					type: newValue.value,
				},
			});
		};


		return(
			<div>
			<form>
				<Toggle label="Use Form Submission" labelStyle={{width:''}} onToggle={this.onFormToggle} />
				{this.state.fill_form && <Dropdown name='node_type' options={options} value={this.state.chosenNode} onChange={updateChosenNode}/>}
			</form>
			{(this.state.chosenNode.value !== null) && this.state.fill_form &&
			<div>
			   <h5> Properties: </h5>
			   <Required_Notification istext> * Denotes Required Property </Required_Notification>
			   <br />
			   <SubmitNodeForm 
			   node={node}
			   form={this.state.form}   
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
}

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
