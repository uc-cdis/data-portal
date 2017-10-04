import React, { Component } from 'react';
import { Form, FormError, RadioGroup, Radio } from 'react-form';
import { submitForm, updateForm } from './actions';
import { connect } from 'react-redux';
import { QuestionItem, OptionBullet, SubmitButton, Tooltip } from './style';
import * as constants from './constants';

class Question extends Component {
  render() {
    return (
      <QuestionItem>
        <div>
          <span>{this.props.content.question}</span>
          <Tooltip className="fui-question-circle">
            <p>{this.props.content.hint}</p>
          </Tooltip>
          { this.props.showErrors && <FormError field={this.props.content.id} /> }
        </div>
        <RadioGroup showErrors={false} field={this.props.content.id}>
          {this.props.content.options.map((option, i) => <OptionBullet key={i}><Radio onChange={this.props.onChange} name={this.props.content.id} value={option} />{option}</OptionBullet>,
          )}
        </RadioGroup>
      </QuestionItem>
    );
  }
}

class CertificateComponent extends Component {
  constructor() {
    super();
    this.state = { display_error: false };
    // required to be able to pass to child
    this.hideError = this.hideError.bind(this);
  }
  validateForm(values) {
    // update redux store
    if (Object.keys(values).length > 0) {
      this.props.onUpdateForm(values);
    }
    const result = {};
    for (const item of constants.certificate_form) {
      result[[item.id]] = values[item.id] === item.options[item.answer] ? undefined : 'wrong answer';
    }
    return result;
  }
  // hide errors when user is updating the form
  hideError() {
    this.setState({ display_error: false });
  }

  // show errors when user hits submit button
  showError() {
    this.setState({ display_error: true });
  }
  render() {
    return (
      <div>
        <h4>{constants.title}</h4>
        <Form
          onSubmit={(values) => { this.props.onSubmitForm(values); }}
          validate={values => this.validateForm(values)}
          defaultValues={this.props.certificate.certificate_result}
        >

          {({ errors, submitForm }) => (
            <form>
              {
                constants.certificate_form.map((item, i) => <Question content={item} onChange={this.hideError} index={i} key={i} showErrors={this.state.display_error} />)
              }
              <SubmitButton type="submit" onClick={() => { submitForm(); this.showError(); }}>Submit</SubmitButton>
            </form>
          )}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  certificate: state.certificate,
});

const mapDispatchToProps = dispatch => ({
  onUpdateForm: data => dispatch(updateForm(data)),
  onSubmitForm: data => dispatch(submitForm(data)),
});

const Certificate = connect(mapStateToProps, mapDispatchToProps)(CertificateComponent);
export default Certificate;
