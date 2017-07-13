import React from 'react';
import { connect } from 'react-redux';
import { Box } from './theme';
import Nav from './Nav/component';
import { TimeoutPopup } from './Popup/component';

export const BoxWithNavAndTimeout = ({children}) => {
  return (
    <Box>
      <Nav />
      <TimeoutPopup />
      { children }
    </Box>
  )
};
