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
 * Little quiz component - properties: questionList, title, description, onSubmit
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
    description: PropTypes.string.isRequired,
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
    this.quizContent.addEventListener('scroll',
      () => this.handleScroll(this.quizContent));
    const currentQ = this.qsDom[getQuestionSectionId(Object.values(this.qsDom).length)];
    this.lastOffsetTop = currentQ.offsetTop;
  }

  componentWillUnmount() {
    this.quizContent.removeEventListener('scroll',
      () => this.handleScroll(this.quizContent));
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
    const data = this.props.questionList.map(item => item.options[item.answer]);
    this.props.onSubmit(data, this.props.questionList);
  }

  render() {
    const { questionList, title, description } = this.props;
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
        <div className='quiz__content' ref={(elem) => { this.quizContent = elem; }}>
          <h3 className='quiz__description h3'>{description}</h3>
          <div>
            {
              questionList.map(
                (item, i) =>
                  (
                    <div ref={(elem) => { this.qsDom[getQuestionSectionId(i + 1)] = elem; }} key={`question${i}`}>
                      <Question
                        content={item}
                        ref={(elem) => {
                          this.qs[getQuestionSectionId(i + 1)] = elem;
                        }}
                        idx={i}
                        sectionId={getQuestionSectionId(i + 1)}
                        onChange={isCorrect => this.answerQuestion(i, isCorrect)}
                      />
                    </div>
                  ),
              )
            }
          </div>
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
