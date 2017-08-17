import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import { LoadingSpinnerWrap, LoadingSpinnerSVG } from './style'

export const LoadingSpinnerComponent = () => {
  return (
    <LoadingSpinnerWrap>
      <LoadingSpinnerSVG width='60' height='20' viewBox='0 0 60 20'>
        <circle cx='7' cy='15' r='4' />
        <circle cx='30' cy='15' r='4' />
        <circle cx='53' cy='15' r='4' />
      </LoadingSpinnerSVG>
    </LoadingSpinnerWrap>
  )
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const LoadingSpinner = connect(mapStateToProps, mapDispatchToProps)(LoadingSpinnerComponent);
export default LoadingSpinner;
