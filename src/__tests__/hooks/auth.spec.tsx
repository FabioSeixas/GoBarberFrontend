import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('authHook', () => {
  it('should be able to signIn', async () => {
    apiMock.onPost('sessions').reply(200, {
      user: {
        id: 'user123',
        email: 'userEmail@gmail.com',
        name: 'user-name',
      },
      token: 'token-123',
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'userEmail@gmail.com',
      password: '123123',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', 'token-123');
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(result.current.user),
    );
    expect(result.current.user.email).toBe('userEmail@gmail.com');
  });

  it('should be able to retrieve saved data from local storage', () => {
    const spyGetItem = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(key => {
        switch (key) {
          case '@GoBarber:token':
            return 'token-123';
          case '@GoBarber:user':
            return JSON.stringify({
              id: 'user123',
              email: 'userEmail@gmail.com',
              name: 'user-name',
            });
          default:
            return null;
        }
      });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.id).toEqual('user123');
    expect(spyGetItem).toBeCalledTimes(2);
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            email: 'userEmail@gmail.com',
            name: 'user-name',
          });
        default:
          return null;
      }
    });

    const spyRemoveItem = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBeUndefined();
    expect(spyRemoveItem).toBeCalledTimes(2);
  });

  it('should be able to update user', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            email: 'userEmail@gmail.com',
            name: 'userName',
          });
        default:
          return null;
      }
    });

    const spySetItem = jest.spyOn(Storage.prototype, 'setItem');

    const spyRemoveItem = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    const user = {
      email: 'new-email@gmail.com',
      name: 'newUserName',
      avatar_url: 'image.jpg',
      id: 'user123',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(spyRemoveItem).toHaveBeenCalledWith('@GoBarber:user');
    expect(spySetItem).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user.email).toEqual('new-email@gmail.com');
  });
});
