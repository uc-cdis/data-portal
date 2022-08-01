import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import FilterSetCreateForm from './FilterSetCreateForm';
import { testFilterSets, testReduxStore } from './testData';

/**
 * @param {Partial<Parameters<typeof FilterSetCreateForm>[0]>} [props]
 * @returns {Parameters<typeof FilterSetCreateForm>[0]}
 */
function getProps(props = {}) {
  const defaultProps = {
    currentFilterSet: {
      name: '',
      description: '',
      filter: testFilterSets[0].filter,
    },
    currentFilter: testFilterSets[0].filter,
    filterSets: [],
    isFiltersChanged: false,
    onAction: () => {},
    onClose: () => {},
  };
  return { ...defaultProps, ...props };
}

test('renders', () => {
  const { container, queryByLabelText, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetCreateForm {...getProps()} />
    </Provider>
  );

  expect(container).toBeInTheDocument();
  expect(queryByText('Save as a new Filter Set')).toBeInTheDocument();

  // name input
  const nameInput = queryByLabelText('Name');
  expect(nameInput).toBeInTheDocument();
  expect(nameInput).toHaveAttribute('placeholder', 'Enter the Filter Set name');

  // description textarea
  const descriptionTextarea = queryByLabelText('Description');
  expect(descriptionTextarea).toBeInTheDocument();
  expect(descriptionTextarea).toHaveAttribute(
    'placeholder',
    'Describe the Filter Set (optional)'
  );

  // filter display
  const filterDisplay = container.querySelector('.explorer-filter-display');
  expect(filterDisplay).toBeInTheDocument();
  expect(filterDisplay).toHaveTextContent('Foo is any of "x", ...');
  expect(filterDisplay).toHaveTextContent('Bar is between (0, 1)');

  // buttons
  const closeButton = queryByRole('button', { name: 'Back to page' });
  expect(closeButton).toBeInTheDocument();

  const actionButton = queryByRole('button', { name: 'Save Filter Set' });
  expect(actionButton).toBeInTheDocument();
  expect(actionButton).toHaveClass('g3-button--disabled');
});

test('updates name and description', async () => {
  const user = userEvent.setup();
  const { queryByLabelText } = render(
    <Provider store={testReduxStore}>
      <FilterSetCreateForm {...getProps()} />
    </Provider>
  );

  // name input
  const nameInput = queryByLabelText('Name');
  expect(nameInput).toHaveValue('');
  await user.type(nameInput, 'foo');
  expect(nameInput).toHaveValue('foo');

  // description textarea
  const descriptionTextarea = queryByLabelText('Description');
  expect(descriptionTextarea).toHaveValue('');
  await user.type(descriptionTextarea, 'foo');
  expect(descriptionTextarea).toHaveValue('foo');
});

test('validate name input', async () => {
  const user = userEvent.setup();
  const { queryByLabelText, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetCreateForm
        {...getProps({
          filterSets: testFilterSets,
        })}
      />
    </Provider>
  );

  const nameInput = queryByLabelText('Name');
  const actionButton = queryByRole('button', { name: 'Save Filter Set' });
  expect(actionButton).toHaveClass('g3-button--disabled');

  // invalid - empty
  await user.click(nameInput);
  await user.tab();
  expect(queryByText('Name is required!')).toBeInTheDocument();
  expect(actionButton).toHaveClass('g3-button--disabled');

  // invalid - reserved
  await user.type(nameInput, '*** All Subjects ***');
  await user.tab();
  expect(queryByText('Name is reserved!')).toBeInTheDocument();
  expect(actionButton).toHaveClass('g3-button--disabled');

  // invalid - already in use
  await user.clear(nameInput);
  await user.type(nameInput, testFilterSets[0].name);
  await user.tab();
  expect(queryByText('Name is already in use!')).toBeInTheDocument();
  expect(actionButton).toHaveClass('g3-button--disabled');

  // valid
  await user.clear(nameInput);
  await user.type(nameInput, 'Foo');
  await user.tab();
  expect(actionButton).not.toHaveClass('g3-button--disabled');
});

test('save with user input', async () => {
  const user = userEvent.setup();
  const handleAction = jest.fn();
  const { queryByLabelText, queryByRole } = render(
    <Provider store={testReduxStore}>
      <FilterSetCreateForm {...getProps({ onAction: handleAction })} />
    </Provider>
  );

  const nameInput = queryByLabelText('Name');
  const descriptionTextarea = queryByLabelText('Description');
  const actionButton = queryByRole('button', { name: 'Save Filter Set' });
  expect(actionButton).toHaveClass('g3-button--disabled');

  // provide name & description, and save
  await user.type(nameInput, 'Foo');
  await user.type(descriptionTextarea, 'Bar');
  await user.click(actionButton);
  const saved = {
    name: 'Foo',
    description: 'Bar',
    filter: testFilterSets[0].filter,
  };
  expect(handleAction.mock.calls).toEqual([[saved]]);
});
