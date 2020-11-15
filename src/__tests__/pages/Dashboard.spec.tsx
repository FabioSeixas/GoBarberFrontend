import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import MockDate from 'mockdate';
import MockAdapter from 'axios-mock-adapter';

import api from '../../services/api';
import Dashboard from '../../pages/Dashboard';

const apiMock = new MockAdapter(api);

// apiMock.onGet(new RegExp('/providers')).reply(() => {
//   const days = Array.from({ length: 30 }, (_, i) => {
//     return {
//       day: i + 1,
//       available: true,
//     };
//   });

//   return days;
// });

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
    apiMock.reset();
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

  it('should be able to render correct if today is Saturday', () => {
    MockDate.set(new Date(2020, 10, 1));

    const { getAllByRole } = render(<Dashboard />);

    const dates = getAllByRole('gridcell');

    const selectedDate = dates.find(
      date => !!date.classList.value.match('selected'),
    );

    expect(selectedDate?.textContent).toEqual('2');
  });

  it('should be able to render correct if today is Sunday', () => {
    MockDate.set(new Date(2020, 10, 7));

    const { getAllByRole } = render(<Dashboard />);

    const dates = getAllByRole('gridcell');

    const selectedDate = dates.find(
      date => !!date.classList.value.match('selected'),
    );

    expect(selectedDate?.textContent).toEqual('9');
  });

  it('should be able to change calendar month', () => {
    MockDate.set(new Date(2020, 10, 9));

    const { getByText, getByLabelText } = render(<Dashboard />);

    const nextMonthButton = getByLabelText('Next Month');

    fireEvent.click(nextMonthButton);

    const currentMonth = getByText('Dezembro 2020');

    expect(currentMonth).toBeTruthy();
  });
});
