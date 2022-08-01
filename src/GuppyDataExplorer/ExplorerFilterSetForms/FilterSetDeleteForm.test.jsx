import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import FilterSetDeleteForm from './FilterSetDeleteForm';
import { testFilterSets, testReduxStore } from './testData';

/**
 * @param {Partial<Parameters<typeof FilterSetDeleteForm>[0]>} [props]
 * @returns {Parameters<typeof FilterSetDeleteForm>[0]}
 */
function getProps(props = {}) {
  const defaultProps = {
    currentFilterSet: testFilterSets[0],
    onAction: () => {},
    onClose: () => {},
  };
  return { ...defaultProps, ...props };
}

test('renders', () => {
  const { container, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetDeleteForm {...getProps()} />
    </Provider>
  );

  expect(container).toBeInTheDocument();
  expect(
    queryByText('Are you sure to delete the current Filter Set?')
  ).toBeInTheDocument();

  // buttons
  const closeButton = queryByRole('button', { name: 'Back to page' });
  expect(closeButton).toBeInTheDocument();

  const actionButton = queryByRole('button', { name: 'Delete Filter Set' });
  expect(actionButton).toBeInTheDocument();
});

test('deletes current filter set', async () => {
  const user = userEvent.setup();
  const handleAction = jest.fn();
  const { queryByRole } = render(
    <Provider store={testReduxStore}>
      <FilterSetDeleteForm {...getProps({ onAction: handleAction })} />
    </Provider>
  );

  const actionButton = queryByRole('button', { name: 'Delete Filter Set' });

  // delete current
  await user.click(actionButton);
  const deleted = testFilterSets[0];
  expect(handleAction.mock.calls).toEqual([[deleted]]);
});
