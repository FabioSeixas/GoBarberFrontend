import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import SignUp from '../../pages/SignUp';
import api from '../../services/api';

const mockHistoryPush = jest.fn();
const mockAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactChild }) => children,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockAddToast,
    }),
  };
});

jest.mock('../../services/api');

const apiPost = api.post as jest.Mock;

describe('SignUp', () => {
  beforeEach(() => {
    mockHistoryPush.mockClear();
    mockAddToast.mockClear();
  });

  it('should be able to signUp', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const userField = getByPlaceholderText('Usuário');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');

    fireEvent.change(userField, { target: { value: 'new-user-name' } });
    fireEvent.change(emailField, { target: { value: 'newUser@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: 'new-user-password' } });

    fireEvent.click(getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to signUp with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const userField = getByPlaceholderText('Usuário');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');

    fireEvent.change(userField, { target: { value: 'new-user-name' } });
    fireEvent.change(emailField, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordField, { target: { value: 'new-user-password' } });

    fireEvent.click(getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should throw an error', async () => {
    apiPost.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const userField = getByPlaceholderText('Usuário');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');

    fireEvent.change(userField, { target: { value: 'new-user-name' } });
    fireEvent.change(emailField, { target: { value: 'newUser@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: 'new-user-password' } });

    fireEvent.click(getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockHistoryPush).not.toHaveBeenCalled();
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
