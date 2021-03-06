import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

import IToken from '@interfaces/IToken';
import IUser from '@interfaces/IUser';
import userApi from '@api/userApi';
import authApi from '@api/authApi';

type Auth = (IUser & IToken & { token: string }) | null | undefined;

const AuthContext = React.createContext<{
  // undefined means the app is loading user credential
  // null is unauthorize
  user: Auth;
  logout: () => void;
  login: (token: string) => void;
}>({
  user: null,
  logout: () => {},
  login: () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider(props: { children?: React.ReactNode }) {
  const [user, setUser] = useState<Auth>(undefined);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    try {
      if (!token) throw new Error();
      const parsedToken = jwtDecode(token) as IToken;
      if (parsedToken.exp * 1000 - Date.now() < 0) throw new Error();

      userApi
        .getUserProfile('me')
        .then((_user) => setUser({ ...parsedToken, ..._user, token }))
        .catch(() => {
          window.localStorage.removeItem('token');
          setUser(null);
        });
    } catch {
      setUser(null);
    }
  }, []);

  function login(token: string) {
    window.localStorage.setItem('token', token);
    window.location.reload();
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
    } finally {
      window.localStorage.removeItem('token');
      window.location.reload();
    }
  }

  return (
    <AuthContext.Provider value={{ user, logout, login }}>{props.children}</AuthContext.Provider>
  );
}
