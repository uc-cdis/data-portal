import React from 'react';
import PropTypes from 'prop-types';

const Simple3SetsTextVersion = ({ title, eulerArgs }) => {
  const {
    set12Size,
    set13Size,
    set23Size,
    set123Size,
    set1Label,
    set2Label,
    set3Label,
  } = eulerArgs;
  return (
    <div className='euler-diagram-text-version'>
      <h2>{title}</h2>
      <ul>
        <li>
          {set1Label} ∩ {set2Label}&nbsp;=&nbsp;{set12Size.toLocaleString()}
        </li>
        <li>
          {set1Label} ∩ {set3Label}&nbsp;=&nbsp;{set13Size.toLocaleString()}
        </li>
        <li>
          {set2Label} ∩ {set3Label}&nbsp;=&nbsp;{set23Size.toLocaleString()}
        </li>
        <li>
          {set1Label} ∩ {set2Label} ∩ {set3Label}&nbsp;=&nbsp;
          {set123Size.toLocaleString()}
        </li>
      </ul>
    </div>
  );
};

Simple3SetsTextVersion.propTypes = {
  title: PropTypes.string.isRequired,
  eulerArgs: PropTypes.object.isRequired,
};

export default Simple3SetsTextVersion;
