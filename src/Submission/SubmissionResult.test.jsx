import React from 'react';
import { shallow } from 'enzyme';
import AceEditor from 'react-ace';

import SubmissionResult from './SubmissionResult';

describe('the submission result component', () => {
  const testData = [
    {
      type: 'type1',
    },
    {
      type: 'type2',
      errors: ['bla bla bla'],
    },
    {
      type: 'type2',
    },
    {
      type: 'type2',
      errors: ['bla bla bla'],
    },
  ];

  it('presents a summary of a successful submission', () => {
    const $dom = shallow(
      <SubmissionResult status={200} data={testData} entityCounts={{ type1: 1, type2: 3 }} />);
    const $summary = $dom.find('#cd-summary__result_200');
    expect($summary).toHaveLength(1);
    const $li = $summary.find('li');
    expect($li).toHaveLength(2); // type1 and type2
  });

  it('presents a summary of a failed submission', () => {
    const $dom = shallow(<SubmissionResult status={400} data={testData} />);
    const $summary = $dom.find('#cd-summary__result_400');
    expect($summary).toHaveLength(1);
    const $jsonError = $summary.find(AceEditor);
    expect($jsonError).toHaveLength(1);
  });

  it('tries to help on a 504 timeout', () => {
    const $dom = shallow(<SubmissionResult status={504} data={testData} />);
    const $summary = $dom.find('#cd-summary__result_504');
    expect($summary).toHaveLength(1);
  });
});
