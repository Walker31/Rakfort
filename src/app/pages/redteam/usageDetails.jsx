import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';
import { useRedTeamConfig } from '../../contexts/redteamconfigcontext';

// Example config data for demo loading (you'll need to define this or import it)
const EXAMPLE_CONFIG = {
  purpose: 'Example purpose: travel booking AI assistant.',
  applicationDefinition: {
    purpose: 'Example purpose: travel booking AI assistant.',
    redteamUser: 'A traveler looking for budget flights to Europe.',
    connectedSystems: 'Flight booking system, CRM system.',
    accessToData: 'Flight prices, schedules, user profile.',
    forbiddenData: 'Other users\' profiles, sensitive company info.',
    accessToActions: 'Search flights, book flights.',
    forbiddenActions: 'Cancel other users\' bookings.',
  },
};

const UsageDetails = () => {
  const theme = useTheme();
  const { config, updateApplicationDefinition, setFullConfig } = useRedTeamConfig();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [testMode, setTestMode] = useState('application');
  const [externalSystemEnabled, setExternalSystemEnabled] = useState(
    Boolean(config.applicationDefinition.connectedSystems?.trim()),
  );

  const isPurposePresent = config.applicationDefinition.purpose && config.applicationDefinition.purpose.trim() !== '';

  // Placeholder event recorder function
  const recordEvent = (eventName, eventData) => {
    // Implement your analytics/event tracking here
    console.log('Event:', eventName, eventData);
  };

  useEffect(() => {
    recordEvent('webui_page_view', { page: 'redteam_config_purpose' });
  }, []);

  const handleTestModeChange = (event, newMode) => {
    if (newMode !== null) {
      setTestMode(newMode);

      if (newMode === 'model') {
        // Clear applicationDefinition fields on switching to model test mode
        Object.keys(config.applicationDefinition).forEach((key) => {
          updateApplicationDefinition(key, '');
        });
      }

      recordEvent('feature_used', { feature: 'redteam_test_mode_change', mode: newMode });
    }
  };

  const handleLoadExample = () => {
    const hasData =
      config.applicationDefinition.purpose?.trim() !== '' ||
      Object.values(config.applicationDefinition).some((val) => val?.trim() !== '');

    if (hasData) {
      setConfirmDialogOpen(true);
    } else {
      recordEvent('feature_used', { feature: 'redteam_config_example' });
      setTestMode('application');
      setExternalSystemEnabled(true);
      setFullConfig(EXAMPLE_CONFIG);
    }
  };

  const handleConfirmLoadExample = () => {
    recordEvent('feature_used', { feature: 'redteam_config_example' });
    setTestMode('application');
    setExternalSystemEnabled(true);
    setFullConfig(EXAMPLE_CONFIG);
    setConfirmDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex justify-between mb-4 align-middle">
        <div className="text-2xl dark:text-white">Usage Details</div>
        <Button variant="outlined" onClick={handleLoadExample}>
          Load Example
        </Button>
      </div>

      <ToggleButtonGroup
        value={testMode}
        exclusive
        onChange={handleTestModeChange}
        aria-label="test mode"
      >
        <ToggleButton
          value="application"
          aria-label="test application"
          sx={{
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            flex: 1,
            '&.Mui-selected': {
              color: 'primary.main',
              borderColor: 'primary.main',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
            I'm testing an application
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Test a complete AI application with its context
          </Typography>
        </ToggleButton>

        <ToggleButton
          value="model"
          aria-label="test model"
          sx={{
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            flex: 1,
            '&.Mui-selected': {
              color: 'primary.main',
              borderColor: 'primary.main',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
            I'm testing a model
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Test a model directly without application context
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      {testMode === 'application' ? (
        <>
          <div className="mx-10 border border-info/30 dark:border-info/50 rounded-md p-4 bg-info/5 dark:bg-info/10 text-info text-sm flex items-start gap-2">
            <svg
              className="w-5 h-5 text-info shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0zM9 9a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0V9zm1-4a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 10 5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-900 dark:text-gray-100">
              The more information you provide, the better the redteam attacks will be. You can leave
              fields blank if they're not relevant, and you'll be able to revise information later.
            </span>
          </div>

          <div className="flex flex-col">
            <div className="justify-end text-black dark:text-white text-2xl font-normal">Purpose</div>

            <div className="justify-end text-gray-900 dark:text-white/60 font-normal">
              The primary use of AI in this application
            </div>
            <TextField
              fullWidth
              onChange={(e) => updateApplicationDefinition('purpose', e.target.value)}
              placeholder="e.g. You are a travel agent specialized in budget trips to Europe."
              margin="normal"
              value={config.applicationDefinition.purpose}
              multiline
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="justify-end text-black dark:text-white text-2xl font-normal">
              Describe the user the redteamer is impersonating
            </div>
            <TextField
              fullWidth
              onChange={(e) => updateApplicationDefinition('redteamUser', e.target.value)}
              placeholder="e.g. A traveler looking for budget flights to Europe. An employee of the company."
              value={config.applicationDefinition.redteamUser || ''}
            />
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-medium mb-2">External System Access</h2>

            <div className="flex items-center gap-2 mb-2">
              <Switch
                checked={externalSystemEnabled}
                onChange={(e) => setExternalSystemEnabled(e.target.checked)}
                inputProps={{ 'aria-label': 'toggle external system access' }}
              />
              <p className="text-base text-gray-800 dark:text-gray-200">
                This application connects to external systems
              </p>
            </div>
          </div>

          {externalSystemEnabled && (
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  What external systems are connected to this application?
                </p>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  className="mt-2"
                  onChange={(e) => updateApplicationDefinition('connectedSystems', e.target.value)}
                  placeholder="e.g. A CRM system for managing customer relationships. Flight booking system. Internal company knowledge base."
                  value={config.applicationDefinition.connectedSystems || ''}
                />
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  What data is available to the LLM from connected systems that the user has access
                  to?
                </p>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  className="mt-2"
                  onChange={(e) => updateApplicationDefinition('accessToData', e.target.value)}
                  placeholder="e.g. User profiles, transaction histories, flight prices, schedules."
                  value={config.applicationDefinition.accessToData || ''}
                />
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  What data is forbidden to access, even if technically accessible?
                </p>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  className="mt-2"
                  onChange={(e) => updateApplicationDefinition('forbiddenData', e.target.value)}
                  placeholder="e.g. Other users' profiles, sensitive company information."
                  value={config.applicationDefinition.forbiddenData || ''}
                />
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  What actions is the LLM allowed to take through external systems?
                </p>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  className="mt-2"
                  onChange={(e) => updateApplicationDefinition('accessToActions', e.target.value)}
                  placeholder="e.g. Search flights, book flights."
                  value={config.applicationDefinition.accessToActions || ''}
                />
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  What actions are forbidden, even if technically possible?
                </p>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  className="mt-2"
                  onChange={(e) => updateApplicationDefinition('forbiddenActions', e.target.value)}
                  placeholder="e.g. Cancel other users' bookings."
                  value={config.applicationDefinition.forbiddenActions || ''}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Model test mode UI if needed */}
          <Typography variant="body1" sx={{ mt: 2 }}>
            You are now testing the model directly without application context.
          </Typography>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded p-6 max-w-md mx-4">
            <Typography variant="h6" gutterBottom>
              Load example configuration?
            </Typography>
            <Typography variant="body2" gutterBottom>
              Loading the example will overwrite your current inputs. Are you sure?
            </Typography>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outlined"
                onClick={() => setConfirmDialogOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmLoadExample}
                type="button"
              >
                Load Example
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Next Button, conditionally disabled */}
      <div className="flex justify-end mt-6">
        <Button
          variant="contained"
          disabled={testMode === 'application' && !isPurposePresent}
          endIcon={<KeyboardArrowRightIcon />}
          type="button"
          onClick={() => {
            /* your next step handler */
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UsageDetails;
