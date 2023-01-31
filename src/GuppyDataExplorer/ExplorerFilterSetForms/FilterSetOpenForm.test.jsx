import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import FilterSetOpenForm from './FilterSetOpenForm';
import { testFilterSets, testReduxStore, testToken } from './testData';

/**
 * @param {Partial<Parameters<typeof FilterSetOpenForm>[0]>} [props]
 * @returns {Parameters<typeof FilterSetOpenForm>[0]}
 */
function getProps(props = {}) {
  const defaultProps = {
    currentFilterSet: { name: '', description: '', filter: {} },
    filterSets: testFilterSets,
    fetchWithToken: (token) =>
      new Promise((resolve, reject) => {
        if (token === testToken) resolve(testFilterSets[0]);
        else reject();
      }),
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

test('switch filter set source', async () => {
  const user = userEvent.setup();
  const { queryByLabelText, queryByRole } = render(
    <Provider store={testReduxStore}>
      <FilterSetOpenForm {...getProps()} />
    </Provider>
  );

  const savedRadioInput = queryByLabelText('Saved by me');
  const sharedRadioInput = queryByLabelText('Shared via token');
  let nameSelectInput = queryByLabelText('Name');
  let descriptionTextarea = queryByLabelText('Description');
  let tokenTextInput = queryByLabelText('Token');
  let useTokenButton = queryByRole('button', { name: 'Use token' });

  expect(savedRadioInput).toBeInTheDocument();
  expect(savedRadioInput).toBeChecked();
  expect(sharedRadioInput).toBeInTheDocument();
  expect(sharedRadioInput).not.toBeChecked();
  expect(nameSelectInput).toBeInTheDocument();
  expect(descriptionTextarea).toBeInTheDocument();
  expect(tokenTextInput).not.toBeInTheDocument();
  expect(useTokenButton).not.toBeInTheDocument();

  await user.click(sharedRadioInput);
  nameSelectInput = queryByLabelText('Name');
  descriptionTextarea = queryByLabelText('Description');
  tokenTextInput = queryByLabelText('Token');
  useTokenButton = queryByRole('button', { name: 'Use token' });
  expect(savedRadioInput).not.toBeChecked();
  expect(sharedRadioInput).toBeChecked();
  expect(nameSelectInput).not.toBeInTheDocument();
  expect(descriptionTextarea).not.toBeInTheDocument();
  expect(useTokenButton).toBeInTheDocument();
  expect(useTokenButton).toHaveClass('g3-button--disabled');
});

test('displays selected filter set', async () => {
  const user = userEvent.setup();
  const { container, queryByLabelText } = render(
    <Provider store={testReduxStore}>
      <FilterSetOpenForm {...getProps()} />
    </Provider>
  );

  const nameSelectContainer = container.querySelectorAll(
    '.simple-input-field__input'
  )[1];
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
  expect(handleAction.mock.calls).toEqual([[opened, false]]);
});

test('displays shared filter set', async () => {
  const user = userEvent.setup();
  const { container, queryByLabelText, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetOpenForm {...getProps()} />
    </Provider>
  );
  const filterDisplay = container.querySelector('.explorer-filter-display');

  // use shared source
  await user.click(queryByLabelText('Shared via token'));

  // success with valid token
  await user.type(queryByLabelText('Token'), testToken);
  await user.click(queryByRole('button', { name: 'Use token' }));
  expect(
    queryByText('Error: Check your token and try again.')
  ).not.toBeInTheDocument();
  expect(filterDisplay).toHaveTextContent('Foo is any of "x", ...');
  expect(filterDisplay).toHaveTextContent('Bar is between (0, 1)');
  expect(filterDisplay).not.toHaveTextContent('With Lorem of "ipsum"');

  // error with invalid token
  await user.type(queryByLabelText('Token'), 'foo');
  await user.click(queryByRole('button', { name: 'Use token' }));
  expect(
    queryByText('Error: Check your token and try again.')
  ).toBeInTheDocument();
  expect(filterDisplay).toHaveTextContent('No Filters');
});

test('opens selected filter set', async () => {
  const handleAction = jest.fn();
  const user = userEvent.setup();
  const { queryByLabelText, queryByRole } = render(
    <Provider store={testReduxStore}>
      <FilterSetOpenForm {...getProps({ onAction: handleAction })} />
    </Provider>
  );
  const actionButton = queryByRole('button', { name: 'Open Filter Set' });

  // get shared token and open
  await user.click(queryByLabelText('Shared via token'));
  await user.type(queryByLabelText('Token'), testToken);
  await user.click(queryByRole('button', { name: 'Use token' }));
  await user.click(actionButton);
  const opened = testFilterSets[0];
  expect(handleAction.mock.calls).toEqual([[opened, true]]);
});
