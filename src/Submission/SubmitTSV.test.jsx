import React from 'react';
import { mount } from 'enzyme';

import SubmitTSV from './SubmitTSV';

describe('the TSV submission componet', () => {
  const testProjName = 'bogusProject';

  function buildTest(submission = { file: '', submit_result: '', submit_status: 200 }, submitCallback = () => {}) {
    const $dom = mount(
      <SubmitTSV
        path={testProjName}
        submission={submission}
        onUploadClick={() => { console.log('onUpload'); }}
        onSubmitClick={(typeStr, path, dict) => { console.log('onSubmitClick'); submitCallback(typeStr, path, dict); }}
        onFileChange={() => { console.log('onFileChange'); }}
      />,
    );

    return { $dom };
  }

  it('hides the "submit" button when data is not available', () => {
    const { $dom } = buildTest({ file: '', submit_result: '', submit_status: 200 });
    expect($dom.find('#cd-submit-tsv__upload-button').length).toBe(1);
    expect($dom.find('#cd-submit-tsv__submit-button').length).toBe(0);
    expect($dom.find('#cd-submit-tsv__result').length).toBe(0);
  });

  it('shows a "submit" button when a tsv or json file has been uploaded', () => {
    const state = { file: JSON.stringify({ type: 'whatever', submitter_id: 'frickjack' }), submit_result: '', submit_status: 200 };
    return new Promise((resolve) => {
      const { $dom } = buildTest(state, (typeStr, path) => {
        expect(path).toBe(testProjName);
        resolve('ok');
      });
      expect($dom.find('#cd-submit-tsv__upload-button').length).toBe(1);
      const $submit = $dom.find('#cd-submit-tsv__submit-button');
      expect($submit.length).toBe(1);
      expect($dom.find('#cd-submit-tsv__result').length).toBe(0);
      $submit.simulate('click');
    });
  });

  it('shows a submit result when appropriate', () => {
    const state = {
      file: JSON.stringify({ type: 'whatever', submitter_id: 'frickjack' }),
      submit_result: JSON.stringify({ message: 'submission failed' }),
      submit_status: 200,
    };
    const { $dom } = buildTest(state);
    expect($dom.find('#cd-submit-tsv__upload-button').length).toBe(1);
    expect($dom.find('#cd-submit-tsv__submit-button').length).toBe(1);
    expect($dom.find('#cd-submit-tsv__result').length).toBe(1);
  });
});
