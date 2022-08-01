import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import FilterSetOpenForm from './FilterSetOpenForm';
import { testFilterSets, testReduxStore } from './testData';

/**
 * @param {Partial<Parameters<typeof FilterSetOpenForm>[0]>} [props]
 * @returns {Parameters<typeof FilterSetOpenForm>[0]}
 */
function getProps(props = {}) {
  const defaultProps = {
    currentFilterSet: { name: '', description: '', filter: {} },
    filterSets: testFilterSets,
    onAction: () => {},
    onClose: () => {},
  };
  return { ...defaultProps, ...props };
}

test('renders', () => {
  const { container, queryByLabelText, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetOpenForm {...getProps()} />
    </Provider>
  );

  expect(container).toBeInTheDocument();
  expect(queryByText('Select a saved Filter Set to open')).toBeInTheDocument();

  // name select
  const nameSelect = queryByLabelText('Name');
  expect(nameSelect).toBeInTheDocument();

  // description textarea
  const descriptionTextarea = queryByLabelText('Description');
  expect(descriptionTextarea).toBeInTheDocument();
  expect(descriptionTextarea).toHaveAttribute('placeholder', 'No description');
  expect(descriptionTextarea).toBeDisabled();

  // filter display
  const filterDisplay = container.querySelector('.explorer-filter-display');
  expect(filterDisplay).toBeInTheDocument();
  expect(filterDisplay).toHaveTextContent('No Filters');

  // buttons
  const closeButton = queryByRole('button', { name: 'Back to page' });
  expect(closeButton).toBeInTheDocument();

  const actionButton = queryByRole('button', { name: 'Open Filter Set' });
  expect(actionButton).toBeInTheDocument();
});

test('displays selected filter set', async () => {
  const user = userEvent.setup();
  const { container, queryByLabelText } = render(
    <Provider store={testReduxStore}>
      <FilterSetOpenForm {...getProps()} />
    </Provider>
  );

  const nameSelectContainer = container.querySelector(
    '.simple-input-field__input'
  );
  const nameSelectInput = queryByLabelText('Name');
  const descriptionTextarea = queryByLabelText('Description');
  const filterDisplay = container.querySelector('.explorer-filter-display');

  // select first
  await user.type(nameSelectInput, 'Simple');
  await user.tab();
  expect(nameSelectContainer).toHaveTextContent(testFilterSets[0].name);
  expect(descriptionTextarea).toHaveTextContent(testFilterSets[0].description);
  expect(filterDisplay).toHaveTextContent('Foo is any of "x", ...');
  expect(filterDisplay).toHaveTextContent('Bar is between (0, 1)');
  expect(filterDisplay).not.toHaveTextContent('With Lorem of "ipsum"');

  // select second
  await user.type(nameSelectInput, 'Complex');
  await user.tab();
  expect(nameSelectContainer).toHaveTextContent(testFilterSets[1].name);
  expect(descriptionTextarea).toHaveTextContent(testFilterSets[1].description);
  expect(filterDisplay).toHaveTextContent('Foo is any of "x", ...');
  expect(filterDisplay).toHaveTextContent('With Lorem of "ipsum"');
  expect(filterDisplay).toHaveTextContent('Bar is between (0, 1)');
  expect(filterDisplay).toHaveTextContent('Baz is any of "hello", ...');
});

test('opens selected filter set', async () => {
  const user = userEvent.setup();
  const handleAction = jest.fn();
  const { queryByLabelText, queryByRole } = render(
    <Provider store={testReduxStore}>
      <FilterSetOpenForm {...getProps({ onAction: handleAction })} />
    </Provider>
  );
  const nameSelectInput = queryByLabelText('Name');
  const actionButton = queryByRole('button', { name: 'Open Filter Set' });

  // select first and open
  await user.type(nameSelectInput, 'Simple');
  await user.tab();
  await user.click(actionButton);
  const opened = testFilterSets[0];
  expect(handleAction.mock.calls).toEqual([[opened]]);
});
