import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import FilterSetShareForm from './FilterSetShareForm';
import { testReduxStore, testToken } from './testData';

/**
 * @param {Partial<Parameters<typeof FilterSetShareForm>[0]>} [props]
 * @returns {Parameters<typeof FilterSetShareForm>[0]}
 */
function getProps(props = {}) {
  const defaultProps = {
    onAction: () => Promise.resolve(testToken),
    onClose: () => {},
  };
  return { ...defaultProps, ...props };
}

test('renders', async () => {
  const { container, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetShareForm {...getProps()} />
    </Provider>
  );

  await waitFor(() => expect(container).toBeInTheDocument());

  const titleText = 'Use the following token to share your Filter Set';
  expect(queryByText(titleText)).toBeInTheDocument();

  const closeButton = queryByRole('button', { name: 'Back to page' });
  expect(closeButton).toBeInTheDocument();
});

test('token generated', async () => {
  const { container, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetShareForm {...getProps()} />
    </Provider>
  );

  await waitFor(() => expect(container).toBeInTheDocument());

  expect(queryByText(testToken)).toBeInTheDocument();

  const copyButton = queryByRole('button', { name: 'Copy to clipboard' });
  expect(copyButton).toBeInTheDocument();
});

test('token failed', async () => {
  const { container, queryByRole, queryByText } = render(
    <Provider store={testReduxStore}>
      <FilterSetShareForm
        {...getProps({
          onAction: () => Promise.reject(),
        })}
      />
    </Provider>
  );

  await waitFor(() => expect(container).toBeInTheDocument());

  expect(queryByText(testToken)).not.toBeInTheDocument();

  const tryAgainButton = queryByRole('button', { name: 'Try again' });
  expect(tryAgainButton).toBeInTheDocument();
});
