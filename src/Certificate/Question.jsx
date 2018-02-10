import PropTypes from 'prop-types';
import { RadioGroup, Radio } from 'react-form';
import React, { Component } from 'react';
import styled from 'styled-components';

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
                  option =>
                    (<OptionBullet key={option}><Radio
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

export default Question;
