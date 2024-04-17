import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AtlasDataDictionaryLoading from './AtlasDataDictionaryLoading';
import TableData from './TestData/TableData';

jest.mock('../../../localconf', () => ({ cohortMiddlewarePath: '/api/endpoint' }));

describe('AtlasDataDictionaryLoading component', () => {
  it('renders loading state initially', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      text: () => Promise.resolve(JSON.stringify({ total: 5, data: [] })),
    });
    const { getByText } = render(<AtlasDataDictionaryLoading />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders data table after loading with error when response is unexpected', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      text: () => Promise.resolve(JSON.stringify({ unexpected: 'keyvalue pair' })),
    });
    const { getByText } = render(<AtlasDataDictionaryLoading />);
    await waitFor(() => expect(getByText('Data Not Available')).toBeInTheDocument());
  });
  it('renders data table after loading with expected format', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      text: () => Promise.resolve(JSON.stringify(TableData)),
    });
    render(<AtlasDataDictionaryLoading />);
    await waitFor(() => expect(screen.getByText(TableData.data[0].conceptName)).toBeInTheDocument());
    // After the first one has been found, test all others:
    const values = Object.values(TableData.data[0]);
    for (let i = 0; i < values.length; i += 1) {
      // if there is a value and it is a number or string, check that it is in the document
      if (values[i] && (values[i].toFixed || values[i].substring)) {
        const textMatches = screen.getAllByText(values[i], { exact: false });
        // eslint-disable-next-line no-await-in-loop
        await waitFor(() => expect(textMatches[0]).toBeInTheDocument());
      }
    }
  });
});
