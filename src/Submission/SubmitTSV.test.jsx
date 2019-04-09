import React from 'react';
import { mount } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SubmitTSV from './SubmitTSV';

describe('the TSV submission componet', () => {
  const testProjName = 'bogusProject';
  /* Mutes large warning:
  * "Could not load worker TypeError:
  * (window.URL || window.webkitURL).createObjectURL is not a function"
  * Currently no easy workaround
  */
  global.console.warn = jest.fn();

  /* Little helper for constructing a <SubmitTSV> jest/enzyme test
   *
   * @param {file, submit_result, submit_status} submission property passed through to <SubmitTSV>
   * @param {function} submitCallback invoked by onSubmitClick property on <SubmitTSV>
   * @return enzymejs wrapper of <SubmitTSV> with properties from params
   */
  function buildTest(submission = { file: '', submit_result: '', submit_status: 200 }, submitCallback = () => {}) {
    const $dom = mount(
      <MuiThemeProvider>
        <SubmitTSV
          project={testProjName}
          submission={submission}
          onUploadClick={() => { console.log('onUpload'); }}
          onSubmitClick={(project) => { console.log('onSubmitClick'); submitCallback(project); }}
          onFileChange={() => { console.log('onFileChange'); }}
        />
      </MuiThemeProvider>,
    );

    return { $dom };
  }

  it('hides the "submit" button when data is not available', () => {
    const { $dom } = buildTest({ file: '', submit_result: '', submit_status: 200 });
    expect($dom.find('label[id="cd-submit-tsv__upload-button"]').length).toBe(1);
    expect($dom.find('button[id="cd-submit-tsv__submit-button"]').length).toBe(0);
    expect($dom.find('div[id="cd-submit-tsv__result"]').length).toBe(0);
  });

  it('shows a "submit" button when a tsv or json file has been uploaded', () => {
    const state = { file: JSON.stringify({ type: 'whatever', submitter_id: 'frickjack' }), submit_result: '', submit_status: 200 };
    return new Promise((resolve) => {
      const { $dom } = buildTest(state, (project) => {
        // This function runs when the 'Submit' button is clicked
        expect(project).toBe(testProjName);
        resolve('ok');
      });
      expect($dom.find('label[id="cd-submit-tsv__upload-button"]').length).toBe(1);
      const $submit = $dom.find('button[id="cd-submit-tsv__submit-button"]');
      expect($submit.length).toBe(1);
      expect($dom.find('div[id="cd-submit-tsv__result"]').length).toBe(0);
      $submit.simulate('click');
    });
  });

  it('shows a submit result when appropriate', () => {
    const state = {
      file: JSON.stringify({ type: 'whatever', submitter_id: 'frickjack' }),
      submit_result: { message: 'submission ok', entities: [{ type: 'frickjack' }] },
      submit_status: 200,
    };
    const { $dom } = buildTest(state);
    expect($dom.find('label[id="cd-submit-tsv__upload-button"]').length).toBe(1);
    expect($dom.find('button[id="cd-submit-tsv__submit-button"]').length).toBe(1);
    expect($dom.find('div[id="cd-submit-tsv__result"]').length).toBe(1);
  });
});
