import React from 'react';
import PropTypes from 'prop-types';
import CountBox from './CountBox';

class IndexCounts extends React.Component {
  computeSummations = (projectList, countNames) => {
    const sumList = countNames.map(() => 0);
    projectList.forEach(
      (project) => {
        project.counts.forEach(
          (count, j) => {
            sumList[j] += count;
          },
        );
      },
    );
    return sumList.map((sum, i) => ({ name: countNames[i], sum }));
  };

  render() {
    const countCards = this.computeSummations(this.props.projectList, this.props.countNames);
    return (
      <div>
        {
          countCards.map((card, i) =>
            <CountBox key={i} label={card.name} value={card.sum} />)
        }
      </div>
    );
  }
}

IndexCounts.propTypes = {
  projectList: PropTypes.arrayOf(PropTypes.object),
  countNames: PropTypes.arrayOf(PropTypes.string),
};

IndexCounts.defaultProps = {
  projectList: [],
  countNames: [],
};

export default IndexCounts;
