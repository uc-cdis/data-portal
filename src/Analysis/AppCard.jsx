import PropTypes from 'prop-types';
import './AppCard.css';

function AppCard({ title, description, imageUrl }) {
  return (
    <div className='app-card'>
      <h2>{title}</h2>
      <div className='app-card__description'>
        <p>{description}</p>
      </div>
      <img className='app-card__image' src={imageUrl} alt={`${title}`} />
    </div>
  );
}

AppCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default AppCard;
