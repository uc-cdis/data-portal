import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Question from './Question';
import QuizSummary from './QuizSummary';
import './Quiz.less';

const getQuestionSectionId = idx => `Q${idx}`;

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
 * Little quiz component - roperites: questionList, title, onSubmit
 */
class Quiz extends Component {
  static propTypes = {
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
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    questionList: [],
  };

  constructor(props) {
    super(props);
    this.qs = {};
    this.qsDom = {};
    this.state = makeDefaultState(this.props.questionList);
    this.scrolledByClick = false;
  }

  componentDidMount() {
    this.menuHeight = this.menu.offsetHeight;
    this.qsList.addEventListener('scroll',
      () => this.handleScroll(this.qsList));
    const currentQ = this.qsDom[getQuestionSectionId(Object.values(this.qsDom).length)];
    this.lastOffsetTop = currentQ.offsetTop;
  }

  componentWillUnmount() {
    this.qsList.removeEventListener('scroll',
      () => this.handleScroll(this.qsList));
  }

  setCurrentSection(sectionIdx) {
    this.setState({ currentSection: getQuestionSectionId(sectionIdx + 1) });
  }

  resetState = () => {
    this.setState(makeDefaultState(this.props.questionList));
  };

  answerQuestion(questionId, isCorrect) {
    const notDone = this.state.notDone.filter(item => item !== questionId);
    let { rights } = this.state;
    let { wrongs } = this.state;
    if (isCorrect) {
      if (!rights.includes(questionId)) {
        rights.push(questionId);
        rights.sort();
      }
      wrongs = wrongs.filter(item => item !== questionId);
    } else {
      if (!wrongs.includes(questionId)) {
        wrongs.push(questionId);
        wrongs.sort();
      }
      rights = rights.filter(item => item !== questionId);
    }
    this.setState({ notDone, rights, wrongs });
  }

  handleScroll(ctrl) {
    if (this.scrolledByClick) {
      this.scrolledByClick = false;
      return;
    }
    const curPos = ctrl.scrollTop + ctrl.offsetTop;
    // Get id of current scroll item
    let { lastOffsetTop } = this;
    let firstActiveIdx = this.state.currentSection;
    Object.values(this.qs).forEach((item) => {
      const dom = this.qsDom[getQuestionSectionId(item.props.idx + 1)];
      if (dom.offsetTop >= curPos) {
        if (dom.offsetTop <= lastOffsetTop &&
          curPos + ctrl.offsetHeight >= dom.offsetTop + (dom.offsetHeight * 0.9)) {
          lastOffsetTop = dom.offsetTop;
          firstActiveIdx = item.props.idx;
        }
      }
    });
    if (firstActiveIdx !== this.state.currentSection) { this.setCurrentSection(firstActiveIdx); }
  }

  handleClick(e, idx) {
    this.setCurrentSection(idx);
    this.qsList.scrollTop = this.qsDom[getQuestionSectionId(idx + 1)].offsetTop
      - this.qsList.offsetTop;
    e.preventDefault();
    this.scrolledByClick = true;
  }

  handleSubmit() {
    const data = this.props.questionList.map(item => item.options[item.answer]);
    this.props.onSubmit(data, this.props.questionList);
  }

  render() {
    const { questionList, title } = this.props;
    return (
      <div className='quiz__form'>
        <div className='quiz__title'>
          <i className='quiz__icon g3-icon g3-icon--key' />
          <h2 className='quiz__title-text h2'>{title}</h2>
          <div ref={(elem) => { this.menu = elem; }} className='quiz__menu'>
            {
              questionList.map(
                (item, i) => {
                  const section = getQuestionSectionId(i + 1);
                  let styleModifier = '';
                  if (this.state.currentSection === section) { styleModifier += ' quiz__menu-bullet--active'; }
                  return (
                    <a
                      className={`quiz__menu-bullet body${styleModifier}`}
                      onClick={e => this.handleClick(e, i)}
                      href={`#${getQuestionSectionId(i + 1)}`}
                      key={`menuItem${i}`}
                    >
                      {i + 1}
                    </a>
                  );
                }, this,
              )
            }
          </div>
        </div>
        <div
          ref={(elem) => { this.qsList = elem; }}
          className='quiz__questions'
        >
          {
            questionList.map(
              (item, i) =>
                (
                  <div ref={(elem) => { this.qsDom[getQuestionSectionId(i + 1)] = elem; }} key={`question${i}`}>
                    <Question
                      content={item}
                      ref={(elem) => { this.qs[getQuestionSectionId(i + 1)] = elem; }}
                      idx={i}
                      sectionId={getQuestionSectionId(i + 1)}
                      onChange={isCorrect => this.answerQuestion(i, isCorrect)}
                    />
                  </div>
                ),
            )
          }
        </div>
        <QuizSummary
          notDone={this.state.notDone}
          wrongs={this.state.wrongs}
          onSubmit={() => this.handleSubmit()}
        />
      </div>
    );
  }
}

export default Quiz;
