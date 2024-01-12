import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DownloadAllModal from './DownloadModal';
import DownloadStatus from '../../Interfaces/DownloadStatus';

// Mock the setDownloadStatus function
const mockSetDownloadStatus = jest.fn();

// Mock the DownloadStatus for testing
const mockDownloadStatus: DownloadStatus = {
  inProgress: false,
  message: {
    title: 'Test Title',
    content: <div>Test Content</div>,
    active: true,
  },
};

test('DownloadAllModal renders correctly and closes on button click', () => {
  // Render the component with necessary props
  const { getByText } = render(
    <DownloadAllModal
      downloadStatus={mockDownloadStatus}
      setDownloadStatus={mockSetDownloadStatus}
    />
  );

  // Check if the modal renders with the provided title and content
  expect(getByText('Test Title')).toBeInTheDocument();
  expect(getByText('Test Content')).toBeInTheDocument();

  // Click the close button
  fireEvent.click(getByText('Close'));

  // Check that the setDownloadStatus function is called with the expected argument
  expect(mockSetDownloadStatus).toHaveBeenCalledWith({
    message: {
      title: '',
      content: <React.Fragment />,
      active: false,
    },
  });
});
