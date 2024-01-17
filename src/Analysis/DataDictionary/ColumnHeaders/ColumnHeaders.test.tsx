 Here is an example of a Jest unit test using TypeScript for the given `ColumnHeaders` component:

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ColumnHeaders from './ColumnHeaders';
import Header from './Header'; // Assuming you've exported the Header component for testing

interface ISortConfig {
  sortKey: string;
  sortDirection: 'asc' | 'desc';
}

describe('ColumnHeaders', () => {
  it('renders ColumnHeaders with initial sorting state', () => {
    const handleSort = jest.fn();
    const sortConfig: ISortConfig = {};

    const { getByTestId } = render(<ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} />);

    expect(getByTestid('column-headers')).toBeInTheDocument();
  });

  it('calls handleSort when a column is clicked', () => {
    const handleSort = jest.fn();
    const sortConfig: ISortConfig = {};

    const { getByRole } = render(<ColumnHeaders handleSort={handleSort} sortConfig={sortConfig} />);

    fireEvent.click(getByRole('columnheader', { name: 'Vocabulary ID' }));

    expect(handleSort).toHaveBeenCalledWith({ key: 'vocabularyID', direction: 'asc' }); // or 'desc' depending on the initial sorting state
  });
});
```

Make sure you have `@testing-library/react` and its extensions installed for this test to work correctly. Also, ensure that you have exported the `Header` component in a separate file if it is not already included in the test file. This test covers two aspects of the `ColumnHeaders` component: rendering the initial state and handling column clicks to sort data. Adjust as needed for your specific use case.
