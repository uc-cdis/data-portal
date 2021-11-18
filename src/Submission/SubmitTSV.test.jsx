import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import * as testData from './__test__/data.json';
import SubmitTSV from './SubmitTSV';

const testProjName = 'bogusProject';

test('hides the "submit" button when data is not available', () => {
  const { container } = render(
    <SubmitTSV
      project={testProjName}
      submission={{
        file: '',
        submit_result: '',
        submit_status: 200,
      }}
      onUploadClick={() => {}}
      onSubmitClick={() => {}}
      onFileChange={() => {}}
      onFinish={() => {}}
    />
  );
  expect(
    container.querySelector('label[id="cd-submit-tsv__upload-button"]')
  ).toBeInTheDocument();
  expect(
    container.querySelectorAll('button[id="cd-submit-tsv__submit-button"]')
  ).toHaveLength(0);
  expect(
    container.querySelectorAll('div[id="cd-submit-tsv__result"]')
  ).toHaveLength(0);
});

test('shows a "submit" button when a tsv or json file has been uploaded', () => {
  const { container } = render(
    <SubmitTSV
      project={testProjName}
      submission={{
        file: JSON.stringify({ type: 'whatever', submitter_id: 'frickjack' }),
        submit_result: '',
        submit_status: 200,
      }}
      onUploadClick={() => {}}
      onSubmitClick={() => {}}
      onFileChange={() => {}}
      onFinish={() => {}}
    />
  );

  const submitElement = container.querySelector(
    'label[id="cd-submit-tsv__upload-button"]'
  );
  expect(submitElement).toBeInTheDocument();
  const resultElement = container.querySelector(
    'div[id="cd-submit-tsv__result"]'
  );
  expect(resultElement).not.toBeInTheDocument();
});

test('shows a submit result when appropriate', () => {
  const { container } = render(
    <SubmitTSV
      project={testProjName}
      submission={{
        file: JSON.stringify({ type: 'whatever', submitter_id: 'frickjack' }),
        submit_result: {
          message: 'submission ok',
          entities: [{ type: 'frickjack' }],
        },
        submit_status: 200,
      }}
      onUploadClick={() => {}}
      onSubmitClick={() => {}}
      onFileChange={() => {}}
      onFinish={() => {}}
    />
  );
  expect(
    container.querySelector('label[id="cd-submit-tsv__upload-button"]')
  ).toBeInTheDocument();
  expect(
    container.querySelector('button[id="cd-submit-tsv__submit-button"]')
  ).toBeInTheDocument();
  expect(
    container.querySelector('div[id="cd-submit-tsv__result"]')
  ).toBeInTheDocument();
});

test('correctly handles utf-8 files, without corrupting multi-byte special characters', (done) => {
  expect.assertions(3);
  // The 'testData' file contains multi-byte special characters
  const utf8TestData = JSON.stringify(testData);

  // 2. Compare the contents of the uploaded
  // file and the file we passed in.
  function onUploadClick(data, fileType) {
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
  }

  const { container } = render(
    <SubmitTSV
      project={testProjName}
      submission={{ file: '', submit_result: '', submit_status: 200 }}
      onUploadClick={onUploadClick}
      onSubmitClick={() => {}}
      onFileChange={() => {}}
      onFinish={() => {}}
    />
  );

  // 1. Find the file upload button and upload our JSON file with non-ascii characters.
  // This will trigger the 'handleUpload' callback.
  const nonAsciiJSONFile = new File([JSON.stringify(testData)], 'test.json');
  const inputElement = container.querySelector('input[id="file-upload"]');
  expect(inputElement).toBeInTheDocument();
  fireEvent.change(inputElement, {
    target: {
      files: [nonAsciiJSONFile],
    },
  });
});
