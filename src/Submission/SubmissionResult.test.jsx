import { render } from '@testing-library/react';
import SubmissionResult from './SubmissionResult';

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

test('presents a summary of a successful submission', () => {
  const { container } = render(
    <SubmissionResult
      status={200}
      data={testData}
      dataString={''}
      entityCounts={{ type1: 1, type2: 3 }}
      counter={0}
      total={0}
      onFinish={() => {}}
    />
  );
  const summaryElement = container.querySelector('#cd-summary__result_200');
  expect(summaryElement).toBeInTheDocument();
  const listElements = summaryElement.querySelectorAll('li');
  expect(listElements).toHaveLength(2); // type1 and type2
});

test('presents a summary of a failed submission', () => {
  const { container } = render(
    <SubmissionResult
      status={400}
      data={testData}
      dataString={''}
      entityCounts={{ type1: 1, type2: 3 }}
      counter={0}
      total={0}
      onFinish={() => {}}
    />
  );
  const summaryElement = container.querySelector('#cd-summary__result_400');
  expect(summaryElement).toBeInTheDocument();
  const editorElement = summaryElement.querySelector('.ace_editor');
  expect(editorElement).toBeInTheDocument();
});

test('tries to help on a 504 timeout', () => {
  const { container } = render(
    <SubmissionResult
      status={504}
      data={testData}
      dataString={''}
      entityCounts={{ type1: 1, type2: 3 }}
      counter={0}
      total={0}
      onFinish={() => {}}
    />
  );
  const summaryElement = container.querySelector('#cd-summary__result_504');
  expect(summaryElement).toBeInTheDocument();
});
