import React from 'react';
import PropTypes from 'prop-types';
import './AppCard.css';

class AppCard extends React.Component {
  render() {
    return (
      <div className='app-card'>
        <h2>{this.props.title}</h2>
        <div className='app-card__description'>
          <p>{this.props.description}</p>
        </div>
        <img className='app-card__image' src={this.props.imageUrl} alt={`${this.props.title}`} />
      </div>
    );
  }
}

AppCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default AppCard;
