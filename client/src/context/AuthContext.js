import {createContext} from 'react';

const noop = () => {}

export const AuthContext = createContext({
  token: null,
  userId: null,
  logout: noop,
  login: noop,
  isAuthenticated: false,
})
