import React, { useState, useEffect } from 'react';
import { StudyRegistrationConfig } from './StudyRegistrationConfig';
import './StudyRegistration.css';

interface Props {
  config: StudyRegistrationConfig
}

const StudyRegistration: React.FunctionComponent<Props> = (props: Props) => {
  const { config } = props;
};

export default StudyRegistration;
