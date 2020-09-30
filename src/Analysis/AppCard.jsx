import React from 'react';
import PropTypes from 'prop-types';
import { CalculatorOutlined } from '@ant-design/icons';
import './AppCard.css';

class AppCard extends React.Component {
  render() {
    return (
      <div className='app-card'>
        <h2>{this.props.title}</h2>
        <div className='app-card__description'>
          {(this.props.description) ?
            <p>{this.props.description}</p>
            : null
          }
        </div>
        {(this.props.imageUrl) ?
          <img className='app-card__image' src={this.props.imageUrl} alt={`${this.props.title}`} />
          :
          <div className='app-card__image'>
            <CalculatorOutlined />
          </div>
        }
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
