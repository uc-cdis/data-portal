import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Question from './Question';
import QuizSummary from './QuizSummary';
import './Quiz.less';

const getQuestionSectionId = (idx) => `Q${idx}`;

const makeDefaultState = (questions) => {
  const notDone = [];
  questions.forEach(
    (item, i) => {
      notDone.push(i);
    },
  );
  return {
    notDone,
    rights: [],
    wrongs: [],
    currentSection: getQuestionSectionId(1),
  };
};

/**
 * Little quiz component - properties: questionList, title, description, onSubmit
 */
class Quiz extends Component {
  constructor(props) {
    super(props);
    this.qs = {};
    this.qsDom = {};
    this.state = makeDefaultState(this.props.questionList);
    this.scrolledByClick = false;
  }

  componentDidMount() {
    this.quizContent.addEventListener('scroll',
      () => this.handleScroll(this.quizContent));
    const currentQ = this.qsDom[getQuestionSectionId(Object.values(this.qsDom).length)];
    this.lastOffsetTop = currentQ.offsetTop;
  }

  componentWillUnmount() {
    this.quizContent.removeEventListener('scroll',
      () => this.handleScroll(this.quizContent));
  }

  handleScroll(ctrl) {
    if (this.scrolledByClick) {
      this.scrolledByClick = false;
      return;
    }
    // Get id of current scroll item
    const curPos = ctrl.scrollTop + ctrl.offsetTop;
    // lastOffsetTop is set in constructor, store the offsetTop
    // of the last element in list of question (also section list)
    // let { lastOffsetTop } = this;
    // get index of current active section
    let curActiveIdx = this.state.currentSection;
    // for each item in section list (question list)
    // compare with the current position, if the top of section > curPos
    // => if yes, first line of item is still displayed in the screen
    Object.values(this.qs).forEach((item) => {
      const dom = this.qsDom[getQuestionSectionId(item.props.idx + 1)];
      if (dom.offsetTop >= curPos) {
        // if the first line of item < the last selected element
        // and check if the last position of item has already displayed
        // in the subscreen
        if (curPos + ctrl.offsetHeight >= dom.offsetTop + (dom.offsetHeight * 0.9)) {
          // => if two above tests is correct, set the current section to this item
          // => also set the last element for this item,
          // by this way, we can select the lowest item
          // displayed in screen as current item
          // lastOffsetTop = dom.offsetTop;
          curActiveIdx = getQuestionSectionId(item.props.idx + 1);
        }
      }
    });
    if (curActiveIdx !== this.state.currentSection) {
      this.setState({ currentSection: curActiveIdx });
    }
  }

  handleClick(e, idx) {
    this.setCurrentSection(idx);
    this.quizContent.scrollTop = this.qsDom[getQuestionSectionId(idx + 1)].offsetTop
      - this.quizContent.offsetTop;
    e.preventDefault();
    this.scrolledByClick = true;
  }

  handleSubmit() {
    const data = this.props.questionList.map((item) => item.options[item.answer]);
    this.props.onSubmit(data, this.props.questionList);
  }

  setCurrentSection(sectionIdx) {
    this.setState({ currentSection: getQuestionSectionId(sectionIdx + 1) });
  }

  resetState = () => {
    this.setState(makeDefaultState(this.props.questionList));
  };

  answerQuestion(questionId, isCorrect) {
    this.setState((prevState) => {
      const notDone = prevState.notDone.filter((item) => item !== questionId);
      let { rights } = prevState;
      let { wrongs } = prevState;
      if (isCorrect) {
        if (!rights.includes(questionId)) {
          rights.push(questionId);
          rights.sort();
        }
        wrongs = wrongs.filter((item) => item !== questionId);
      } else {
        if (!wrongs.includes(questionId)) {
          wrongs.push(questionId);
          wrongs.sort();
        }
        rights = rights.filter((item) => item !== questionId);
      }
      return { notDone, rights, wrongs };
    });
  }

  render() {
    const {
      questionList, title, subtitle, description, hasCorrectAnswers,
    } = this.props;
    const canSubmit = this.state.notDone.length === 0;
    return (
      <div className='quiz__form'>
        <div className={subtitle ? 'quiz__title tall' : 'quiz__title'}>
          <h2 className='quiz__title-text h2'>{title}</h2>
          { subtitle ? <h3 className='quiz__subtitle-text h3'>{subtitle}</h3> : null }
        </div>
        <div ref={(elem) => { this.menu = elem; }} className={hasCorrectAnswers ? 'quiz__menu' : 'quiz__menu top'}>
          {
            questionList.map(
              (item, i) => {
                const section = getQuestionSectionId(i + 1);
                let styleModifier = '';
                if (this.state.currentSection === section) { styleModifier += ' quiz__menu-bullet--active'; }
                return (
                  <a
                    className={`quiz__menu-bullet body${styleModifier}`}
                    onClick={(e) => this.handleClick(e, i)}
                    href={`#${getQuestionSectionId(i + 1)}`}
                    key={`menuItem${i}`}
                  >
                    {i + 1}
                  </a>
                );
              }, this,
            )
          }
          {
            !hasCorrectAnswers
              ? (
                <Button
                  class='quiz__submit'
                  label='Submit'
                  enabled={canSubmit}
                  onClick={() => this.handleSubmit()}
                />
              )
              : null
          }
        </div>
        <div className={hasCorrectAnswers ? 'quiz__content' : 'quiz__content full'} ref={(elem) => { this.quizContent = elem; }}>
          { description ? <h3 className='quiz__description h3'>{description}</h3> : null }
          <div>
            {
              questionList.map(
                (item, i) => (
                  <div ref={(elem) => { this.qsDom[getQuestionSectionId(i + 1)] = elem; }} key={`question${i}`}>
                    <Question
                      content={item}
                      ref={(elem) => {
                        this.qs[getQuestionSectionId(i + 1)] = elem;
                      }}
                      idx={i}
                      sectionId={getQuestionSectionId(i + 1)}
                      onChange={(isCorrect) => this.answerQuestion(i, isCorrect)}
                      hasCorrectAnswers={hasCorrectAnswers}
                    />
                  </div>
                ),
              )
            }
          </div>
        </div>
        {
          hasCorrectAnswers
            ? (
              <QuizSummary
                notDone={this.state.notDone}
                wrongs={this.state.wrongs}
                onSubmit={() => this.handleSubmit()}
              />
            )
            : null
        }
      </div>
    );
  }
}

Quiz.propTypes = {
  questionList: PropTypes.arrayOf(
    PropTypes.shape(
      {
        name: PropTypes.string,
        question: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.string),
        answer: PropTypes.number,
        hint: PropTypes.string,
      },
    ),
  ),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  hasCorrectAnswers: PropTypes.bool.isRequired,
};

Quiz.defaultProps = {
  questionList: [],
  subtitle: null,
};

export default Quiz;
