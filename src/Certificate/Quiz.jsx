import React, { Component } from 'react';
import { Form } from 'react-form';
import PropTypes from 'prop-types';
import Question from './Question';
import './Quiz.less';

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
    ),
    onUpdateForm: PropTypes.func.isRequired,
    onSubmitForm: PropTypes.func.isRequired,
    certificate: PropTypes.object,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    certificate: null,
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
                      key={item}
                      showErrors={this.state.displayError}
                    />),
                )
              }
              <button className="quiz__submit-button" type="button" onClick={() => { submitForm(); this.showError(); }}>Submit</button>
            </form>
          )}
        </Form>
      </div>
    );
  }
}

export default Quiz;
