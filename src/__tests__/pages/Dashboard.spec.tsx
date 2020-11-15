import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import MockDate from 'mockdate';

import Dashboard from '../../pages/Dashboard';

jest.mock('../../hooks/auth', () => {
  return {
    useAuth() {
      return {
        user: {
          avatar_url: 'image.jpg',
          email: 'user-email@gmail.com',
          id: 'user123',
          name: 'user-name',
        },
      };
    },
  };
});

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    MockDate.reset();
  });

  it('should be able to render dashboard', () => {
    const { getByText } = render(<Dashboard />);

    const username = getByText('user-name');

    expect(username).toBeTruthy();
  });

  it('should be able to change selected date', () => {
    MockDate.set(new Date(2020, 10, 3));

    const { getByLabelText, getAllByRole } = render(<Dashboard />);

    const selectDate = getByLabelText('Wed Nov 04 2020');

    fireEvent.click(selectDate);

    const dates = getAllByRole('gridcell');

    const selectedDate = dates.find(
      date => !!date.classList.value.match('selected'),
    );

    expect(selectedDate?.textContent).toEqual('4');
  });

  it('should not be able to select a past date', () => {
    MockDate.set(new Date(2020, 10, 3));

    const { getByLabelText, getAllByRole } = render(<Dashboard />);

    const selectDate = getByLabelText('Mon Nov 02 2020');

    fireEvent.click(selectDate);

    const dates = getAllByRole('gridcell');

    const selectedDate = dates.find(
      date => !!date.classList.value.match('selected'),
    );

    expect(selectedDate?.textContent).toEqual('3');
  });
});
