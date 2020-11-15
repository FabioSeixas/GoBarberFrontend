import React from 'react';
import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { useToast, ToastProvider } from '../../hooks/toast';

const TestPage: React.FC = () => {
  const { addToast } = useToast();

  function handleAddToast() {
    addToast({
      type: 'success',
      title: 'title123',
      description: 'description123',
    });
  }

  return (
    <div>
      <button type="button" onClick={handleAddToast}>
        Add Toast
      </button>
    </div>
  );
};

describe('Toast Hook', () => {
  it('should be able to add Toast', () => {
    const { getByText } = render(<TestPage />, {
      wrapper: ToastProvider,
    });

    const button = getByText('Add Toast');

    fireEvent.click(button);

    const titleElement = getByText('title123');
    const descriptionElement = getByText('description123');

    expect(titleElement).toBeTruthy();
    expect(descriptionElement).toBeTruthy();
  });

  it('should be able to remove a Toast manually', async () => {
    const { getByText, getByTestId } = render(<TestPage />, {
      wrapper: ToastProvider,
    });

    const button = getByText('Add Toast');

    fireEvent.click(button);

    const titleElement = getByText('title123');
    const descriptionElement = getByText('description123');

    const removeButton = getByTestId('remove-toast');

    expect(titleElement).toBeTruthy();
    expect(descriptionElement).toBeTruthy();

    fireEvent.click(removeButton);

    await waitForElementToBeRemoved(getByText('title123'), {
      timeout: 100,
    });
  });
});
