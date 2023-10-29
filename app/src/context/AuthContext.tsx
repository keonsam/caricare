import { ReactNode, createContext, useContext, useState } from 'react';
import { User } from '../types/User';
import jwt from 'jwt-decode';

const initialUser: User = {
  role: 'patient',
  credentialId: '',
  exp: new Date().getTime(),
  info: {},
};
const initial = {
  isLogIn: () => false,
  logIn: () => null,
  logOut: () => null,
  user: initialUser,
  token: '',
};

type IAuthContext = {
  isLogIn: () => boolean;
  logIn: (auth: string) => void;
  logOut: () => void;
  user: User;
  token: string;
};

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<IAuthContext>(initial);

const tokenKey = 'caricare-jwtToken';

const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState(localStorage.getItem(tokenKey) || '');
  const [user, setUser] = useState<User>(token ? jwt(token) : initialUser);

  const isLogIn = () => {
    return !!token && !!user.credentialId && user.exp * 1000 > Date.now();
  };

  const logIn = (auth: string) => {
    setToken(auth);
    setUser(jwt(auth));
    localStorage.setItem(tokenKey, auth);
  };

  const logOut = () => {
    setToken('');
    setUser(initialUser);
    localStorage.removeItem(tokenKey);
    token;
  };

  return (
    <AuthContext.Provider value={{ isLogIn, logIn, logOut, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
