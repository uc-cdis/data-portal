import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import FilterSetUpdateForm from './FilterSetUpdateForm';
import { testFilterSets, testReduxStore } from './testData';

/**
 * @param {Partial<Parameters<typeof FilterSetUpdateForm>[0]>} [props]
 * @returns {Parameters<typeof FilterSetUpdateForm>[0]}
 */
function getProps(props = {}) {
  const defaultProps = {
    currentFilterSet: testFilterSets[0],
    currentFilter: testFilterSets[0].filter,
    isFiltersChanged: false,
    filterSets: testFilterSets,
    onAction: () => {},
    onClose: () => {},
  };
  return { ...defaultProps, ...props };
}

test('renders', () => {
  const { container, queryByLabelText, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetUpdateForm {...getProps()} />
    </Provider>
  );

  expect(container).toBeInTheDocument();
  expect(
    queryByText('Save changes to the current Filter Set')
  ).toBeInTheDocument();

  // name select
  const nameInput = queryByLabelText('Name');
  expect(nameInput).toBeInTheDocument();
  expect(nameInput).toHaveValue(testFilterSets[0].name);

  // description textarea
  const descriptionTextarea = queryByLabelText('Description');
  expect(descriptionTextarea).toBeInTheDocument();
  expect(descriptionTextarea).toHaveValue(testFilterSets[0].description);

  // filter display
  const filterDisplay = container.querySelector('.explorer-filter-display');
  expect(filterDisplay).toBeInTheDocument();
  expect(filterDisplay).toHaveTextContent('Foo is any of "x", ...');
  expect(filterDisplay).toHaveTextContent('Bar is between (0, 1)');

  // buttons
  const closeButton = queryByRole('button', { name: 'Back to page' });
  expect(closeButton).toBeInTheDocument();

  const actionButton = queryByRole('button', { name: 'Save changes' });
  expect(actionButton).toBeInTheDocument();
  expect(actionButton).toHaveClass('g3-button--disabled');
});

test('indicates filter has changed', async () => {
  const { container } = render(
    <Provider store={testReduxStore}>
      <FilterSetUpdateForm
        {...getProps({
          currentFilter: testFilterSets[1].filter,
          isFiltersChanged: true,
        })}
      />
    </Provider>
  );

  expect(container).toHaveTextContent(
    'You have changed filters for this Filter Set.'
  );

  const [filterDisplay, changedFilterDisplay] = container.querySelectorAll(
    '.explorer-filter-display'
  );
  expect(filterDisplay).not.toHaveTextContent('With Lorem of "ipsum"');
  expect(changedFilterDisplay).toHaveTextContent('With Lorem of "ipsum"');
});

test('updates current filter set', async () => {
  const user = userEvent.setup();
  const handleAction = jest.fn();
  const { queryByLabelText, queryByRole } = render(
    <Provider store={testReduxStore}>
      <FilterSetUpdateForm
        {...getProps({
          currentFilter: testFilterSets[1].filter,
          isFiltersChanged: true,
          onAction: handleAction,
        })}
      />
    </Provider>
  );
  const nameInput = queryByLabelText('Name');
  const descriptionTextarea = queryByLabelText('Description');
  const actionButton = queryByRole('button', { name: 'Save changes' });

  // update and save
  await user.clear(nameInput);
  await user.type(nameInput, 'Foo');
  await user.clear(descriptionTextarea);
  await user.type(descriptionTextarea, 'Bar');
  await user.click(actionButton);
  const updated = {
    name: 'Foo',
    description: 'Bar',
    filter: testFilterSets[1].filter,
  };
  expect(handleAction.mock.calls).toEqual([[updated]]);
});
