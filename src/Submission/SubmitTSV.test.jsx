import React from 'react';
import { mount } from 'enzyme';
import * as testData from './__test__/data.json';

import SubmitTSV from './SubmitTSV';

describe('the TSV submission component', () => {
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
   * @param {function} uploadCallback invoked by onUploadClick property on <SubmitTSV>
   * @return enzymejs wrapper of <SubmitTSV> with properties from params
   */
  function buildTest(submission = { file: '', submit_result: '', submit_status: 200 }, submitCallback = () => { }, uploadCallback = () => { }) {
    const $dom = mount(
      <SubmitTSV
        project={testProjName}
        submission={submission}
        onUploadClick={(newFile, fileType) => { console.log('onUploadClick'); uploadCallback(newFile, fileType); }}
        onSubmitClick={(project) => { console.log('onSubmitClick'); submitCallback(project); }}
        onFileChange={() => { console.log('onFileChange'); }}
      />,
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

  it('correctly handles utf-8 files, without corrupting multi-byte special characters', (done) => {
    expect.assertions(3);
    // The 'testData' file contains multi-byte special characters
    const utf8TestData = JSON.stringify(testData);

    // 2. Compare the contents of the uploaded
    // file and the file we passed in.
    const handleUpload = (data, fileType) => {
      try {
        expect(fileType).toBe('application/json');
        // Expect the uploaded file, as a string, to be the same as the test file,
        // as a string -- ie, for the utf8 encoding to be preserved.
        expect(data).toEqual(utf8TestData);
      } catch (err) {
        // We need to use done.fail(err) because otherwise the exception thrown by
        // expect will not be caught by this test.
        done.fail(err);
      }
      done();
    };

    const { $dom } = buildTest(undefined, undefined, handleUpload);

    // 1. Find the file upload button and upload our JSON file with non-ascii characters.
    // This will trigger the 'handleUpload' callback.
    const nonAsciiJSONFile = new File([JSON.stringify(testData)], 'test.json');
    const $input = $dom.find('input[id="file-upload"]');
    expect($input.length).toBe(1);
    $input.simulate('change', {
      target: {
        files: [
          nonAsciiJSONFile,
        ],
      },
    });
  });
});
