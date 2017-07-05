import { uploadTSV, submitToServer, updateFileContent } from './submitActions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { button, UploadButton, SubmitButton } from '../theme';
import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import Form from 'react-jsonschema-form';

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
	width: 400px;
	height:20px;
	padding: 5px 8px;
`;

const Label = styled.label`
	margin: 3px;
    display:inline-block;
    padding-left:3px;
 
`;

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

const TextInput = ({name, required, description, onChange}) =>{
	return(
		<div>
			<Label htmlFor={name}> {name}: </Label>
			{description != '' && <Input_Description>{description}</Input_Description>}
			<br />
			<Input type="text" name={name} required={required}/>
			{required && <Required_Notification> {"*"} </Required_Notification>}
			
		</div>
	)
};

const StyledTextInput = styled(TextInput)`
	width:500px;
	height: 50px;
`;

const EnumInput = ({name, options, value, required, description, onChange}) => {
	options = options.map( (option, i) => ({label:option, value:option}) );
	
	let wrapper = (newValue) =>{
		onChange(name, newValue);
	};

	return(
		<div>
			<Label htmlFor={name}> {name}: </Label>
			{description != '' && <Input_Description>{description}</Input_Description>}
			<br />
			<Dropdown name={name} options={options} value={value} onChange={wrapper} />
			{required && <Required_Notification> {"*"} </Required_Notification>}
			<br/> 
		</div>

	)

};

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
				value={this.props.value}
				required={this.props.required}
				description={this.props.description}
				onChange={this.props.onChangeEnum}/>
			)
		} else if(this.props.property[0].type == 'string' && this.props.property[1].type == 'null'){
			return(
				<TextInput name={this.props.name} required={this.props.required} description={this.props.description}  />
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
				value={this.props.value}
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
	return(
	<div>
	<h1> {name}</h1>
	{properties.map( (property, i)=> {
		let description = ('description' in node.properties[property]) ? node.properties[property]['description'] : '';
		if (description == ''){
            description = ('term' in node.properties[property]) ? node.properties[property]['term']['description'] : '';
               }
        let required = (requireds.indexOf(property) > -1);
		
		return(
			<StyledTextInput key={i} name={property} required={required} description={description} onChange={onChange}/>)
	})}
	</div>
)};

const SubmitNodeForm = ({node, properties, requireds, onChange, onChangeEnum}) => {
	return(
		<div>
		<form>
		{properties.map( (property, i) => {
				let description = ('description' in node.properties[property]) ? node.properties[property]['description'] : '';
				if (description == ''){
                   description = ('term' in node.properties[property]) ? node.properties[property]['term']['description'] : '';
               }
               let required = (requireds.indexOf(property) > -1);

               if('enum' in node.properties[property]){
               	return(
               		<EnumInput key={i} 
               		name={property} 
               		options={node.properties[property]['enum']} 
               		value={property} 
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
               			onChange={onChange} /> 
               	)
               }else{
               	  return(<StyledTextInput key={i} name={property} required={required} description={description} onChange={onChange}/>)}
		})}
		<SubmitFormButton type="submit"> Submit Form </SubmitFormButton>
		</form>
		</div>

	)
};



class SubmitFormContainer extends Component {
	static propTypes = {
		node_types: PropTypes.array,
		submission: PropTypes.object,
	}

	state = {
		chosenNode:{value: null, label:""},
		fillForm: false,
	}

	render(){
		let dictionary = this.props.submission.dictionary;
		let node_types = this.props.submission.node_types;
		let node = dictionary[this.state.chosenNode.value];
		let options = node_types.map( (node_type) => {return {value: node_type, label: node_type}});

		let updateChosenNode = (newValue) =>{
			this.setState({
				chosenNode: newValue
			});
		}

		let onChange = (event) =>{
			const target = event.target;
		    const value = target.type === 'checkbox' ? target.checked : target.value;
		    const name = target.name;
		    
		    console.log("onChange Vanilla:")
		    console.log(name);
		    console.log(value);
		    
		    this.setState({
		      [name]: value
		    });
		};

		let onChangeEnum = (name, newValue) =>{
			console.log("onChange Enum:")
			console.log(name + " : " + newValue.value);

			this.setState({
				[name]: newValue
			});
		};

		return(
			<div>
			<form>
				<SubmitButton onChange={onChange}> Fill Out Form </SubmitButton>
				<Dropdown name='node_type' options={options} value={this.state.chosenNode} onChange={updateChosenNode} />
			</form>
			{(this.state.chosenNode.value != null) &&
			<div>
			   <h5> Properties: </h5>
			   <Required_Notification istext> * Denotes Required Property </Required_Notification>
			   <br />
			   <SubmitNodeForm 
			   node={node}   
			   properties={Object.keys(node.properties)}
			   requireds={('required' in node) ? node.required : []}
			   onChange={onChange}
			   onChangeEnum={onChangeEnum} />
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

		}
};

let SubmitForm = connect(mapStateToProps, matpDispatchToProps)(SubmitFormContainer);

export default SubmitForm;