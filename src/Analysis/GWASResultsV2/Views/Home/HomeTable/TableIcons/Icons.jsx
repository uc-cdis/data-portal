import React from 'react';
import Succeeded from './Succeeded';
import Pending from './Pending';
import Running from './Running';
import Failed from './Failed';
import Error from './Error';
import './Icons.css';

const Icons = {
  Error: () => <Error />,
  Failed: () => <Failed />,
  Pending: () => <Pending />,
  Running: () => <Running />,
  Succeeded: () => <Succeeded />,
};

export default Icons;
