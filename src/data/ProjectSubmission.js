import React from 'react';
import Nav from './nav.js'
import { connect } from 'react-redux';
import SubmitTSV from './submitTSV'
import styled from 'styled-components';
import { Link } from 'react-router';


const ProjectSubmission = (props) => (
  <div>
    <Nav />
    <h2>{props.params.project}</h2>
    <SubmitTSV />
  </div>
)

export default ProjectSubmission;
