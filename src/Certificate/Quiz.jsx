import React, { Component } from 'react';
import { Form, RadioGroup, Radio } from 'react-form';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { button } from '../theme';


const OptionBullet = styled.p`
  input {
    margin-right: 1em;
  }
`;
const QuestionItem = styled.section`
  .FormError {
    display: inline-block !important;
    margin-left: 2em;
    font-style: italic;
    font-size: 0.8em;
    color: red;
  }
`;
const SubmitButton = styled.a`
  color: darkgreen;
  border: 1px solid darkgreen;
  ${button};
`;

const Tooltip = styled.div`
  display: inline-block;
  margin-left: 1em;
  position: relative;
  & p{
    display: none;
  }
  &:hover p {
    display: block;
    position: absolute;
    left: 30px;
    background: antiquewhite;
    width: 300px;
    padding: 0.5em;
    margin: 0px;
    line-height: 1.5em;
    top: 0px;
  }
`;


class Question extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    showErrors: PropTypes.bool,
  };

  static defaultProps = {
    showErrors: false,
  };

  render() {
    return (
      <QuestionItem>
        <div>
          <span>{this.props.content.question}</span>
          <Tooltip className="fui-question-circle">
            <p>{this.props.content.hint}</p>
          </Tooltip>
          { this.props.showErrors && <div className={'FormError'}>Error!?!?</div> }
        </div>
        <RadioGroup showErrors={false} field={this.props.content.id}>
          {
            group => (<div>
              {
                this.props.content.options.map(
                  (option, i) =>
                    (<OptionBullet key={i}><Radio
                      onChange={this.props.onChange}
                      name={this.props.content.id}
                      value={option}
                      group={group}
                    />{option}</OptionBullet>),
                )
              }
            </div>)
          }
        </RadioGroup>
      </QuestionItem>
    );
  }
}

/**
 * Little quiz component - roperites: questionList, title, onSubmit
 */
class Quiz extends Component {
  static propTypes = {
    questionList: PropTypes.arrayOf(
      PropTypes.shape(
        {
          question: PropTypes.string,
          id: PropTypes.string,
          options: PropTypes.arrayOf(PropTypes.string),
          answer: PropTypes.number,
          hint: PropTypes.string,
        },
      ),
    ).isRequired,
    onUpdateForm: PropTypes.func.isRequired,
    onSubmitForm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { displayError: false };
  }

  validateForm(values) {
    // update redux store
    if (Object.keys(values).length > 0) {
      this.props.onUpdateForm(values);
    }
    const result = {};
    this.props.questionList.forEach((item) => {
      result[[item.id]] = values[item.id] === item.options[item.answer] ? undefined : 'wrong answer';
    });
    return result;
  }
  // hide errors when user is updating the form
  hideError() {
    if (this.state.displayError) {
      this.setState({ displayError: false });
    }
  }

  // show errors when user hits submit button
  showError() {
    if (!this.state.displayError) {
      this.setState({ displayError: true });
    }
  }

  render() {
    const { questionList, title } = this.props;
    return (
      <div>
        <h4>{title}</h4>
        <Form
          onSubmit={(values) => { this.props.onSubmitForm(values); }}
          validate={values => this.validateForm(values)}
          defaultValues={this.props.certificate.certificate_result}
        >

          {({ submitForm }) => (
            <form>
              {
                questionList.map(
                  (item, i) =>
                    (<Question
                      content={item}
                      onChange={() => this.hideError()}
                      index={i}
                      key={i}
                      showErrors={this.state.displayError}
                    />),
                )
              }
              <SubmitButton type="submit" onClick={() => { submitForm(); this.showError(); }}>Submit</SubmitButton>
            </form>
          )}
        </Form>
      </div>
    );
  }
}

export default Quiz;
