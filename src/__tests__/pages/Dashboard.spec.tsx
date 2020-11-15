import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MockDate from 'mockdate';
import MockAdapter from 'axios-mock-adapter';

import api from '../../services/api';
import Dashboard from '../../pages/Dashboard';

const apiMock = new MockAdapter(api);

const appointmentsResponseData = [
  {
    id: 'appointment-1',
    date: '2020-11-09T08:00:00',
    user: {
      avatar_url: 'image-user1.jpg',
      name: 'client-1',
    },
  },
  {
    id: 'appointment-2',
    date: '2020-11-09T10:00:00',
    user: {
      avatar_url: 'image-user2.jpg',
      name: 'client-2',
    },
  },
  {
    id: 'appointment-3',
    date: '2020-11-09T14:00:00',
    user: {
      avatar_url: 'image-user3.jpg',
      name: 'client-3',
    },
  },
];

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
    apiMock.onGet('appointments/me').reply(200, []);
  });

  it('should be able to render dashboard', async () => {
    MockDate.set(new Date(2020, 10, 3));

    render(<Dashboard />);

    const username = screen.getByText('user-name');

    expect(username).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Tarde')).toBeTruthy();
    });
  });

  it('should be able to change selected date', async () => {
    MockDate.set(new Date(2020, 10, 3));

    render(<Dashboard />);

    const selectDate = screen.getByLabelText('Wed Nov 04 2020');

    fireEvent.click(selectDate);

    const dates = screen.getAllByRole('gridcell');

    const selectedDate = dates.find(
      date => !!date.classList.value.match('selected'),
    );

    await waitFor(() => {
      expect(selectedDate?.textContent).toEqual('4');
    });
  });

  it('should not be able to select a past date', async () => {
    MockDate.set(new Date(2020, 10, 3));

    const { getByLabelText, getAllByRole } = render(<Dashboard />);

    const selectDate = getByLabelText('Mon Nov 02 2020');

    fireEvent.click(selectDate);

    const dates = getAllByRole('gridcell');

    const selectedDate = dates.find(
      date => !!date.classList.value.match('selected'),
    );

    await waitFor(() => {
      expect(selectedDate?.textContent).toEqual('3');
    });
  });

  it('should be able to render correct if today is Saturday', async () => {
    MockDate.set(new Date(2020, 10, 1));

    const { getAllByRole } = render(<Dashboard />);

    const dates = getAllByRole('gridcell');

    const selectedDate = dates.find(
      date => !!date.classList.value.match('selected'),
    );

    await waitFor(() => {
      expect(selectedDate?.textContent).toEqual('2');
    });
  });

  it('should be able to render correct if today is Sunday', async () => {
    MockDate.set(new Date(2020, 10, 7));

    const { getAllByRole } = render(<Dashboard />);

    const dates = getAllByRole('gridcell');

    const selectedDate = dates.find(
      date => !!date.classList.value.match('selected'),
    );

    await waitFor(() => {
      expect(selectedDate?.textContent).toEqual('9');
    });
  });

  it('should be able to change calendar month', async () => {
    MockDate.set(new Date(2020, 10, 9));

    const { getByText, getByLabelText } = render(<Dashboard />);

    const nextMonthButton = getByLabelText('Next Month');

    fireEvent.click(nextMonthButton);

    const currentMonth = getByText('Dezembro 2020');

    await waitFor(() => {
      expect(currentMonth).toBeTruthy();
    });
  });

  it('should be able to render scheduled appointments', async () => {
    apiMock.onGet('appointments/me').reply(200, appointmentsResponseData);

    MockDate.set(new Date(2020, 10, 9));

    const { getByText } = render(<Dashboard />);

    await waitFor(() => {
      // debug(manha, 10000);
      expect(getByText('client-3')).toBeTruthy();
    });
  });
});
