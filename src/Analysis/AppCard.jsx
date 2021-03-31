import React from 'react';
import PropTypes from 'prop-types';
import './AppCard.css';

class AppCard extends React.Component {
  render() {
    return (
      <div className='app-card'>
        <h2>{this.props.title}</h2>
        <div className='app-card__description'>
          {(this.props.description)
            ? <p>{this.props.description}</p>
            : null}
        </div>
        <img
          className='app-card__image'
          src={(this.props.imageUrl) ? this.props.imageUrl : '/src/img/analysis-icons/default-app.png'}
          alt={`${this.props.title}`}
        />
      </div>
    );
  }
}

AppCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
};

AppCard.defaultProps = {
  description: undefined,
  imageUrl: undefined,
};

export default AppCard;
