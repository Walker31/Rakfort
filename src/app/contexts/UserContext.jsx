import React, { useState, useEffect } from 'react';
import { fetchUserEmail } from '@app/utils/api';
import { UserContext } from './UserContextDef';

export function UserProvider({ children }) {
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserEmail = async () => {
      const userEmail = await fetchUserEmail();
      setEmail(userEmail);
      setIsLoading(false);
    };

    loadUserEmail();
  }, []);

  return (
    <UserContext.Provider value={{ email, setEmail, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
