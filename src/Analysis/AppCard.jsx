import React from 'react';
import PropTypes from 'prop-types';
import './AppCard.css';

class AppCard extends React.Component {
  render() {
    return (
      <div className='app-card'>
        <h2>{this.props.title}</h2>
        <p className='app-card__description'>{this.props.description}</p>
        <img className='app-card__image' src={this.props.imageUrl} />
      </div>
    )
  }
}

AppCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default AppCard;
