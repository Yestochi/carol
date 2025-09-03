
import React, { createContext, useContext } from 'react';
import type { User } from '../types';

const CurrentUserContext = createContext<User | null>(null);

interface CurrentUserProviderProps {
  children: React.ReactNode;
  value: User;
}

export const CurrentUserProvider: React.FC<CurrentUserProviderProps> = ({ children, value }) => {
  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = (): User => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};
