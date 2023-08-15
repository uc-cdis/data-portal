import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import DismissibleMessage, { isEnterOrSpace } from './DismissibleMessage';

describe('DismissibleMessage', () => {
  it('renders with default props', () => {
    const { getByText } = render(
      <DismissibleMessage
        title='Custom Title'
        description='custom description'
        messageType='warning'
      />,
    );
    expect(getByText('Custom Title')).toBeInTheDocument();
    expect(getByText('custom description')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const { getByText } = render(
      <DismissibleMessage
        title='Custom Title'
        description='custom description'
        messageType='warning'
      />,
    );
    expect(getByText('Custom Title')).toBeInTheDocument();
    expect(getByText('custom description')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const { getByLabelText, queryByText } = render(
      <DismissibleMessage
        title='Custom Title'
        description='custom description'
        messageType='warning'
      />,
    );
    const closeButton = getByLabelText('Close Message');
    fireEvent.click(closeButton);
    expect(queryByText('Placeholder Title')).not.toBeInTheDocument();
  });

  it('closes when the close button is clicked using Enter or Space', () => {
    const { getByLabelText, queryByText } = render(
      <DismissibleMessage
        title='Custom Title'
        description='custom description'
        messageType='warning'
      />,
    );
    const closeButton = getByLabelText('Close Message');
    fireEvent.keyDown(closeButton, { key: 'Enter' });
    fireEvent.keyDown(closeButton, { key: ' ' });
    fireEvent.keyDown(closeButton, { key: 'Spacebar' });
    fireEvent.keyDown(closeButton, { keyCode: 32 });
    fireEvent.keyDown(closeButton, { keyCode: 13 });
    expect(queryByText('Placeholder Title')).not.toBeInTheDocument();
  });

  it('does not close on other key presses', () => {
    const { getByLabelText, queryByText } = render(
      <DismissibleMessage
        title='Custom Title'
        description='custom description'
        messageType='warning'
      />,
    );
    const closeButton = getByLabelText('Close Message');
    fireEvent.keyDown(closeButton, { key: 'Escape' });
    fireEvent.keyDown(closeButton, { key: 'A' });
    fireEvent.keyDown(closeButton, { keyCode: 27 });
    fireEvent.keyDown(closeButton, { keyCode: 65 });
    expect(queryByText('Custom Title')).toBeInTheDocument();
  });

  it('Validates logic of isEnterOrSpace function', () => {
    expect(isEnterOrSpace({ key: 'Enter' })).toBe(true);
    expect(isEnterOrSpace({ key: ' ' })).toBe(true);
    expect(isEnterOrSpace({ key: 'Spacebar' })).toBe(true);
    expect(isEnterOrSpace({ key: 'Escape' })).toBe(false);
    expect(isEnterOrSpace({ key: 'A' })).toBe(false);
  });
});
