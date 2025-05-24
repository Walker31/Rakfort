import React, { useState, useEffect } from 'react';
import { ShiftKeyContext } from './ShiftKeyContextDef';

export const ShiftKeyProvider = ({ children }) => {
  const [isShiftKeyPressed, setShiftKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Shift') {
        setShiftKeyPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'Shift') {
        setShiftKeyPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <ShiftKeyContext.Provider value={isShiftKeyPressed}>
      {children}
    </ShiftKeyContext.Provider>
  );
};
