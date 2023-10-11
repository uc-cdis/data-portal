import React from 'react';
import PropTypes from 'prop-types';
import './TeamProjectHeader.css'

const TeamProjectHeader = ({ displayType, bannerText, displayModal }) => {
    return (
        <h1 className='team-project-header'>Team Project Header</h1>
    )
};

TeamProjectHeader.propTypes = {
    displayType: PropTypes.string,
    bannerText: PropTypes.string,
}

TeamProjectHeader.defaultProps = {
    displayType: 'default',
};

export default TeamProjectHeader;
