// src/context/RedTeamConfigContext.js
import React, { createContext, useContext, useState } from 'react';

// Initial/default config structure
const defaultConfig = {
  applicationDefinition: {
    purpose: '',
    redteamUser: '',
    connectedSystems: '',
    accessToData: '',
    forbiddenData: '',
    accessToActions: '',
    forbiddenActions: '',
  },
  purpose: '',
};

const RedTeamConfigContext = createContext();

export function RedTeamConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);

  // Helper to update fields inside applicationDefinition
  const updateApplicationDefinition = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      applicationDefinition: {
        ...prev.applicationDefinition,
        [key]: value,
      },
    }));
  };

  // Helper to set the entire config (e.g., for loading an example)
  const setFullConfig = (newConfig) => setConfig(newConfig);

  return (
    <RedTeamConfigContext.Provider value={{ config, setConfig, updateApplicationDefinition, setFullConfig }}>
      {children}
    </RedTeamConfigContext.Provider>
  );
}

export function useRedTeamConfig() {
  const context = useContext(RedTeamConfigContext);
  if (!context) throw new Error('useRedTeamConfig must be used within RedTeamConfigProvider');
  return context;
}
