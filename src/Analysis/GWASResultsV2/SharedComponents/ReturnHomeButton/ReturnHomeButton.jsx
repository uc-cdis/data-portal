import React, { useContext } from 'react';
import { SharedContext } from '../../Utils/constants';
import './ReturnHomeButton.css';

const ReturnHomeButton = () => {
  const setCurrentView = useContext(SharedContext);
  return (
    <button onClick={() => setCurrentView('home')}>Return Home Button</button>
  );
};
export default ReturnHomeButton;
