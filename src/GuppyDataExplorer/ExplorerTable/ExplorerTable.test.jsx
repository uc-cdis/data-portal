import { render, screen } from '@testing-library/react';
import { capitalizeFirstLetter } from '../../utils';
import ExplorerTable from './index';

const guppyConfig = {
  dataType: 'subject',
  downloadAccessor: '',
  fieldMapping: [],
  nodeCountTitle: '',
};
const tableConfig = {
  fields: ['foo', 'bar', 'fizz.buzz'],
  linkFields: ['bar'],
  ordered: false,
  filterInfo: {},
};
const rawData = [
  { foo: 0, bar: 'a', fizz: { buzz: true } },
  { foo: 1, bar: 'b', fizz: { buzz: true } },
  { foo: 2, bar: 'c', fizz: { buzz: true } },
  { foo: 3, bar: 'd', fizz: { buzz: true } },
  { foo: 4, bar: 'e', fizz: { buzz: true } },
  { foo: 5, bar: 'f', fizz: { buzz: true } },
  { foo: 6, bar: 'g', fizz: { buzz: true } },
  { foo: 7, bar: 'h', fizz: { buzz: true } },
  { foo: 8, bar: 'i', fizz: { buzz: true } },
  { foo: 9, bar: 'j', fizz: { buzz: true } },
  { foo: 10, bar: 'k', fizz: { buzz: false } },
  { foo: 11, bar: 'l', fizz: { buzz: false } },
  { foo: 12, bar: 'm', fizz: { buzz: false } },
  { foo: 13, bar: 'n', fizz: { buzz: false } },
  { foo: 14, bar: 'o', fizz: { buzz: false } },
  { foo: 15, bar: 'p', fizz: { buzz: false } },
  { foo: 16, bar: 'q', fizz: { buzz: false } },
  { foo: 17, bar: 'r', fizz: { buzz: false } },
  { foo: 18, bar: 's', fizz: { buzz: false } },
  { foo: 19, bar: 't', fizz: { buzz: false } },
];

test('renders', () => {
  const props = {
    accessibleCount: 0,
    fetchAndUpdateRawData: () => Promise.resolve(),
    guppyConfig,
    isLocked: false,
    tableConfig,
    totalCount: 100,
  };
  const { container } = render(<ExplorerTable {...props} />);
  expect(container.firstElementChild).toHaveClass('explorer-table');
});

test('hides description if locked', () => {
  const props = {
    accessibleCount: 0,
    fetchAndUpdateRawData: () => Promise.resolve(),
    guppyConfig,
    tableConfig,
    totalCount: 100,
  };
  const { rerender } = render(<ExplorerTable {...props} isLocked={false} />);
  expect(screen.queryByText('Showing 0 of 0 subjects')).toBeInTheDocument();

  // locked
  rerender(<ExplorerTable {...props} isLocked />);
  expect(screen.queryByText('Showing 0 of 0 subjects')).not.toBeInTheDocument();
});

test('update description based on data access', () => {
  const props = {
    fetchAndUpdateRawData: () => Promise.resolve(),
    guppyConfig,
    isLocked: false,
    tableConfig,
  };

  // no access
  const { container, rerender } = render(
    <ExplorerTable {...props} accessibleCount={0} totalCount={100} />
  );
  expect(screen.queryByText('Showing 0 of 0 subjects')).toBeInTheDocument();
  const RequestAccessInfoIcon = container.querySelector(
    'svg[data-icon="triangle-exclamation"]'
  );
  expect(RequestAccessInfoIcon).toBeInTheDocument();

  // partial access
  rerender(<ExplorerTable {...props} accessibleCount={10} totalCount={100} />);
  expect(
    screen.queryByText('Showing 1 - 10 of 10 subjects')
  ).toBeInTheDocument();
  expect(RequestAccessInfoIcon).toBeInTheDocument();

  // full access
  rerender(<ExplorerTable {...props} accessibleCount={100} totalCount={100} />);
  expect(
    screen.queryByText('Showing 1 - 20 of 100 subjects')
  ).toBeInTheDocument();
  expect(RequestAccessInfoIcon).not.toBeInTheDocument();
});

test('shows correct table headers', () => {
  const props = {
    accessibleCount: 0,
    fetchAndUpdateRawData: () => Promise.resolve(),
    guppyConfig,
    isLocked: false,
    tableConfig,
    totalCount: 100,
  };

  render(<ExplorerTable {...props} />);
  const headers = screen.queryAllByRole('columnheader');
  expect(headers).toHaveLength(3);

  // columns are sorted
  const fieldNames = tableConfig.fields.map(capitalizeFirstLetter).sort();
  for (const [i, fieldName] of fieldNames.entries())
    expect(headers[i]).toHaveTextContent(fieldName);
});

test('Shows placeholder in table', () => {
  const props = {
    accessibleCount: 0,
    fetchAndUpdateRawData: () => Promise.resolve(),
    guppyConfig,
    isLocked: false,
    tableConfig,
    totalCount: 20,
  };

  // no data
  const { rerender } = render(<ExplorerTable {...props} />);
  expect(screen.queryByText('No data to display')).toBeInTheDocument();

  // locked
  rerender(<ExplorerTable {...props} isLocked />);
  expect(
    screen.queryByText('You only have access to summary data')
  ).toBeInTheDocument();
});

test('Shows data in table', () => {
  const props = {
    accessibleCount: rawData.length,
    fetchAndUpdateRawData: () => Promise.resolve(),
    guppyConfig,
    isLocked: false,
    rawData,
    tableConfig,
    totalCount: rawData.length,
  };

  const { container } = render(<ExplorerTable {...props} />);
  const rows = container.querySelector('tbody').querySelectorAll('tr');
  expect(rows).toHaveLength(rawData.length);

  const cells = container.querySelector('tbody').querySelectorAll('td');
  expect(cells).toHaveLength(rawData.length * tableConfig.fields.length);
});
