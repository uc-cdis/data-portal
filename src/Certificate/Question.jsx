import PropTypes from 'prop-types';
import { RadioGroup, Radio } from 'react-form';
import React, { Component } from 'react';
import './Question.less';

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
      <section>
        <div>
          <span>{this.props.content.question}</span>
          <div className="fui-question-circle question__tooltip">
            <p>{this.props.content.hint}</p>
          </div>
          { this.props.showErrors && <div className="FormError question__form-error">Error!?!?</div> }
        </div>
        <RadioGroup showErrors={false} field={this.props.content.id}>
          {
            group => (<div>
              {
                this.props.content.options.map(
                  option =>
                    (<p className="question__option-bullet" key={option}><Radio
                      onChange={this.props.onChange}
                      name={this.props.content.id}
                      value={option}
                      group={group}
                    />
                      {option}
                    </p>),
                )
              }
            </div>)
          }
        </RadioGroup>
      </section>
    );
  }
}

export default Question;
