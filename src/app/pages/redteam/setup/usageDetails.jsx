import React, { useState, useEffect } from 'react';
import { useRedTeamConfig, EXAMPLE_CONFIG } from './hooks/useRedTeamConfig.js';
import UsageDetailsHeader from './usageDetailsHeader';
import InfoAlert from './InfoAlert';
import LabeledTextField from './LabelledTextField';
import ExternalSystemFields from './ExternalSystemFields';
import LoadExampleDialog from './LoadExampleDialog';
import NextButton from './NextButton';
import { useNavigate } from 'react-router-dom';

export default function UsageDetails() {
  const { config, updateApplicationDefinition, setFullConfig } = useRedTeamConfig();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [testMode, setTestMode] = useState('application');
  const [externalSystemEnabled, setExternalSystemEnabled] = useState(
    Boolean(config.applicationDefinition.connectedSystems?.trim())
  );
  const navigate = useNavigate();

  const onNext = () => {
    navigate('/redteam/setup/target');
  };

  useEffect(() => {
    // Track page view event (optional)
  }, []);

  const hasFormData = (definition) =>
    Object.values(definition).some((val) => val && val.trim?.() !== '');

  const handleTestModeChange = (event, newMode) => {
    if (newMode !== null) {
      if (newMode === 'model' && hasFormData(config.applicationDefinition)) {
        const confirmClear = window.confirm(
          'Switching to model mode will clear the application details. Proceed?'
        );
        if (!confirmClear) return;
      }

      setTestMode(newMode);

      if (newMode === 'model') {
        Object.keys(config.applicationDefinition).forEach((key) => {
          updateApplicationDefinition(key, '');
        });
      }
    }
  };

  const handleLoadExample = () => {
    const hasData =
      config.applicationDefinition.purpose ||
      hasFormData(config.applicationDefinition);
    if (hasData) {
      setConfirmDialogOpen(true);
    } else {
      setTestMode('application');
      setExternalSystemEnabled(true);
      setFullConfig(EXAMPLE_CONFIG);
    }
  };

  const handleConfirmLoadExample = () => {
    setTestMode('application');
    setExternalSystemEnabled(true);
    setFullConfig(EXAMPLE_CONFIG);
    setConfirmDialogOpen(false);
  };

  return (
    <div className=" bg-gray-50 dark:bg-[#1a102b] text-gray-900 dark:text-white px-4 md:px-12 py-10 space-y-10">
      <UsageDetailsHeader onLoadExample={handleLoadExample} />

      <TestModeToggle testMode={testMode} onChange={handleTestModeChange} />

      {testMode === 'application' ? (
        <div className="space-y-6">
          <InfoAlert>
            The more information you provide, the better the redteam attacks will
            be. You can leave fields blank if they're not relevant, and you'll be
            able to revise information later.
          </InfoAlert>

          <LabeledTextField
            label="Purpose"
            description="The primary objective of the AI in this application."
            value={config.applicationDefinition.purpose}
            onChange={(e) => updateApplicationDefinition('purpose', e.target.value)}
            placeholder="e.g. You are a travel agent specialized in budget trips to Europe."
            multiline
            rows={4}
          />

          <LabeledTextField
            label="Describe the user the redteamer is impersonating"
            value={config.applicationDefinition.redteamUser}
            onChange={(e) => updateApplicationDefinition('redteamUser', e.target.value)}
            placeholder="e.g. A traveler looking for budget flights to Europe. An employee of the company."
          />

          <ExternalSystemFields
            enabled={externalSystemEnabled}
            onToggle={(e) => setExternalSystemEnabled(e.target.checked)}
            values={config.applicationDefinition}
            onFieldChange={updateApplicationDefinition}
          />
        </div>
      ) : (
        <InfoAlert>
          When testing a model directly, you don't need to provide application
          details. You can proceed to configure the model and test scenarios in
          the next steps.
        </InfoAlert>
      )}

      <div className="flex justify-end">
        <NextButton
          onNext={onNext}
          disabled={
            testMode === 'application' &&
            (!config.applicationDefinition.purpose?.trim() ||
            !config.applicationDefinition.redteamUser?.trim())
          }
        />
      </div>

      <LoadExampleDialog
        open={confirmDialogOpen}
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmLoadExample}
      />
    </div>
  );
}

function TestModeToggle({ testMode, onChange }) {
  const modes = [
    {
      value: 'application',
      title: "I'm testing an application",
      description: 'Test a complete AI application with its context',
    },
    {
      value: 'model',
      title: "I'm testing a model",
      description: 'Test a model directly without application context',
    },
  ];

  const baseClass =
    'flex-1 px-5 py-4 text-center transition-all duration-200 focus:outline-none';
  const selectedClass =
    'bg-purple-100 text-purple-900 dark:bg-[#7904DF] dark:text-white font-semibold shadow-inner';
  const unselectedClass =
    'bg-white text-gray-700 dark:bg-[#3d2070] dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-[#47258c]';

  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="flex border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        {modes.map((mode, index) => {
          const selected = testMode === mode.value;
          return (
            <button
              key={mode.value}
              onClick={() => onChange(null, mode.value)}
              className={`${baseClass} ${
                selected ? selectedClass : unselectedClass
              } ${index !== modes.length - 1 ? 'border-r border-gray-300 dark:border-gray-700' : ''}`}
              type="button"
            >
              <div className="text-sm font-medium">{mode.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {mode.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
