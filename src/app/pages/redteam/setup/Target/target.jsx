import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { callApi } from '../../../../utils/api';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTelemetry } from '../../../../hooks/useTelemetry';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { DEFAULT_HTTP_TARGET, useRedTeamConfig } from '../hooks/useRedTeamConfig';
import { predefinedTargets, customTargetOption } from '../constants';
import BrowserAutomationConfiguration from './BrowserAutomationConfiguration';
import CommonConfigurationOptions from './CommonConfigurationOptions';
import CustomTargetConfiguration from './CustomTargetConfiguration';
import HttpEndpointConfiguration from './HttpEndpointConfiguration';
import TestTargetConfiguration from './TestTargetConfiguration';
import WebSocketEndpointConfiguration from './WebSocketEndpointConfiguration';
import Prompts from '../Prompts';
const selectOptions = [...predefinedTargets, customTargetOption];
const knownTargetIds = predefinedTargets.map((target) => target.value).filter((value) => value !== '');

const validateUrl = (url, type = 'http') => {
  try {
    const parsedUrl = new URL(url);
    if (type === 'http') return ['http:', 'https:'].includes(parsedUrl.protocol);
    if (type === 'websocket') return ['ws:', 'wss:'].includes(parsedUrl.protocol);
    return false;
  } catch {
    return false;
  }
};

const requiresPrompt = (target) => {
  return target.id !== 'http' && target.id !== 'websocket' && target.id !== 'browser';
};

export default function Targets({ onBack, setupModalOpen }) {
  const { config, updateConfig } = useRedTeamConfig();
  const theme = useTheme();
  const [selectedTarget, setSelectedTarget] = useState(config.target || DEFAULT_HTTP_TARGET);
  const [useGuardrail, setUseGuardrail] = useState(config.defaultTest?.assert?.some((a) => a.type === 'guardrails') ?? false);
  const [testingTarget, setTestingTarget] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [bodyError, setBodyError] = useState(null);
  const [urlError, setUrlError] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [promptRequired, setPromptRequired] = useState(requiresPrompt(selectedTarget));
  const [testingEnabled, setTestingEnabled] = useState(selectedTarget.id === 'http');
  const { recordEvent } = useTelemetry();
  const [rawConfigJson, setRawConfigJson] = useState(JSON.stringify(selectedTarget.config, null, 2));

  const navigate = useNavigate();

  const onNext = () => {
    navigate('/redteam/setup/plugin');
    console.log("next pressed");
  }

  useEffect(() => {
    recordEvent('webui_page_view', { page: 'redteam_config_targets' });
  }, []);

  useEffect(() => {
    const updatedTarget = { ...selectedTarget };
    if (useGuardrail) {
      updateConfig('defaultTest', { assert: [{ type: 'guardrails', config: { purpose: 'redteam' } }] });
    } else {
      updateConfig('defaultTest', undefined);
    }
    updateConfig('target', updatedTarget);
    const missing = [];
    if (!selectedTarget.label) missing.push('Target Name');
    if (selectedTarget.id.startsWith('http')) {
      if (!selectedTarget.config.request && (!selectedTarget.config.url || !validateUrl(selectedTarget.config.url))) {
        missing.push('URL');
      }
    }
    setMissingFields(missing);
    setPromptRequired(requiresPrompt(selectedTarget));
  }, [selectedTarget, useGuardrail, updateConfig]);

  const handleTargetChange = (event) => {
    const value = event.target.value;
    const currentLabel = selectedTarget.label;
    recordEvent('feature_used', { feature: 'redteam_config_target_changed', target: value });

    if (value === 'custom') {
      setSelectedTarget({ id: '', label: currentLabel, config: { temperature: 0.5 } });
      setRawConfigJson(JSON.stringify({ temperature: 0.5 }, null, 2));
    } else if (value === 'javascript' || value === 'python') {
      const filePath = value === 'javascript' ? 'file://path/to/custom_provider.js' : 'file://path/to/custom_provider.py';
      setSelectedTarget({ id: filePath, config: {}, label: currentLabel });
    } else if (value === 'http') {
      setSelectedTarget({ ...DEFAULT_HTTP_TARGET, label: currentLabel });
      updateConfig('purpose', '');
    } else if (value === 'websocket') {
      setSelectedTarget({
        id: 'websocket',
        label: currentLabel,
        config: {
          type: 'websocket',
          url: 'wss://example.com/ws',
          messageTemplate: '{"message": "{{prompt}}"}',
          transformResponse: 'response.message',
          timeoutMs: 30000,
        },
      });
      updateConfig('purpose', '');
    } else if (value === 'browser') {
      setSelectedTarget({
        id: 'browser',
        label: currentLabel,
        config: {
          steps: [
            {
              action: 'navigate',
              args: { url: 'https://example.com' },
            },
          ],
        },
      });
    } else {
      setSelectedTarget({ id: value, config: {}, label: currentLabel });
    }
  };

  useEffect(() => {
    setTestingEnabled(selectedTarget.id === 'http');
  }, [selectedTarget]);

  const updateCustomTarget = (field, value) => {
    if (typeof selectedTarget === 'object') {
      const updatedTarget = { ...selectedTarget };
      if (field === 'id') updatedTarget.id = value;
      else if (field === 'url') {
        updatedTarget.config.url = value;
        setUrlError(validateUrl(value) ? null : 'Invalid URL format');
      } else if (field === 'method') updatedTarget.config.method = value;
      else if (field === 'body') {
        updatedTarget.config.body = value;
        const bodyStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (bodyStr.includes('{{prompt}}')) setBodyError(null);
        else if (!updatedTarget.config.request) setBodyError('Request body must contain {{prompt}}');
      } else if (field === 'request') {
        updatedTarget.config.request = value;
        if (value && !value.includes('{{prompt}}')) setBodyError('Raw request must contain {{prompt}} template variable');
        else setBodyError(null);
      } else if (field === 'transformResponse') {
        updatedTarget.config.transformResponse = value;
        const hasGuardrails = value.includes('guardrails:') || value.includes('"guardrails"') || value.includes("'guardrails'");
        setUseGuardrail(hasGuardrails);
        if (hasGuardrails) updateConfig('defaultTest', { assert: [{ type: 'guardrails', config: { purpose: 'redteam' } }] });
        else updateConfig('defaultTest', undefined);
      } else if (field === 'label') updatedTarget.label = value;
      else if (field === 'delay') updatedTarget.delay = value;
      else updatedTarget.config[field] = value;
      setSelectedTarget(updatedTarget);
      updateConfig('target', updatedTarget);
    }
  };

  const updateWebSocketTarget = (field, value) => {
    if (typeof selectedTarget === 'object') {
      const updatedTarget = { ...selectedTarget };
      if (field === 'id') {
        updatedTarget.id = value;
        setUrlError(validateUrl(value, 'websocket') ? null : 'Please enter a valid WebSocket URL (ws:// or wss://)');
      } else if (field in updatedTarget.config) {
        updatedTarget.config[field] = value;
      }
      setSelectedTarget(updatedTarget);
    }
  };

  const handleTestTarget = async () => {
    setTestingTarget(true);
    setTestResult(null);
    recordEvent('feature_used', { feature: 'redteam_config_target_test' });
    try {
      const response = await callApi('/providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedTarget),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const result = data.testResult;
      if (result.error) {
        setTestResult({ providerResponse: data.providerResponse });
      } else if (result.changes_needed) {
        setTestResult({
          success: false,
          message: result.changes_needed_reason,
          suggestions: result.changes_needed_suggestions,
          providerResponse: data.providerResponse,
        });
      } else {
        setTestResult({
          success: true,
          message: 'Target configuration is valid!',
          providerResponse: data.providerResponse,
        });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'An error occurred while testing the target.' });
    } finally {
      setTestingTarget(false);
    }
  };

  return (
    <div className='px-10 py-4'>
    <Stack direction="column" spacing={3} >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }} className='dark:!text-gray-200'>
        Select Red Team Target
      </Typography>
      <Typography variant="body1" className='dark:!text-gray-200'>
        A target is the specific LLM or endpoint you want to evaluate in your red teaming process.
        In Promptfoo targets are also known as providers. You can configure additional targets
        later.
      </Typography>
      <Typography variant="body1" className='dark:!text-gray-200'>
        For more information on available providers and how to configure them, please visit our{' '}
        <Link href="https://www.promptfoo.dev/docs/providers/" target="_blank" rel="noopener">
          provider documentation
        </Link>
        .
      </Typography>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }} className='dark:!text-gray-200'>
          Select a Target
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <FormControl fullWidth className="dark:[&_.MuiInputBase-root]:bg-[#3d2070] dark:[&_.MuiInputBase-root]:text-gray-100 dark:[&_.MuiOutlinedInput-notchedOutline]:border-purple-800">
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <InputLabel id="predefined-target-label" className='dark:!text-gray-200 dark:[&_.MuiInputBase-root]:bg-[#3d2070]'>Target Type</InputLabel>
                <Select
                  labelId="predefined-target-label"
                  value={selectedTarget.id}
                  onChange={handleTargetChange}
                  label="Target Type"
                  fullWidth
                  MenuProps={
                    {
                      slotProps:{
                        
                        className: 'bg-black'
                      }
                    }
                  }
                  className="dark:[&_.MuiSelect-select]:text-gray-100 dark:[&_.MuiSelect-select]:bg-[#3d2070] dark:[&_.MuiOutlinedInput-notchedOutline]:border-purple-800"
                  InputLabelProps={{
                    className: 'dark:!text-gray-300',
                  }}
                >
                  {selectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </FormControl>
        </Box>
        <TextField
          fullWidth
          className="mb-2 dark:[&_.MuiInputBase-root]:bg-[#3d2070] dark:[&_.MuiInputBase-root]:text-gray-100 dark:[&_.MuiOutlinedInput-notchedOutline]:border-purple-800 dark:[&_.MuiInputLabel-root]:text-gray-300"
          label="Target Name"
          value={selectedTarget.label}
          placeholder="e.g. 'customer-service-agent'"
          onChange={(e) => updateCustomTarget('label', e.target.value)}
          margin="normal"
          required
          autoFocus
          slotProps={{
            input: {
              className: 'dark:!text-gray-100 dark:placeholder-white',
            },
            root: {
              className: 'dark:border-purple-800',
            },
          }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }} className='dark:!text-gray-200'>
          The target name will be used to report vulnerabilities. Make sure it's meaningful and
          re-use it when generating new redteam configs for the same target. Eg:
          'customer-service-agent', 'compliance-bot'
        </Typography>
        {(selectedTarget.id.startsWith('javascript') || selectedTarget.id.startsWith('python')) && (
          <TextField
            fullWidth
            label="Custom Target"
            value={selectedTarget.id}
            onChange={(e) => updateCustomTarget('id', e.target.value)}
            margin="normal"
          />
        )}
        {selectedTarget.id.startsWith('file://') && (
          <>
            {selectedTarget.id.endsWith('.js') && (
              <Typography variant="body1" sx={{ mt: 1 }} className='dark:!text-gray-200'>
                Learn how to set up a custom JavaScript provider{' '}
                <Link
                  href="https://www.promptfoo.dev/docs/providers/custom-api/"
                  target="_blank"
                  rel="noopener"
                >
                  here
                </Link>
                .
              </Typography>
            )}
            {selectedTarget.id.endsWith('.py') && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                Learn how to set up a custom Python provider{' '}
                <Link
                  href="https://www.promptfoo.dev/docs/providers/python/"
                  target="_blank"
                  rel="noopener"
                >
                  here
                </Link>
                .
              </Typography>
            )}
          </>
        )}
        {(selectedTarget.id === 'custom' || !knownTargetIds.includes(selectedTarget.id)) && (
          <CustomTargetConfiguration
            selectedTarget={selectedTarget}
            updateCustomTarget={updateCustomTarget}
            rawConfigJson={rawConfigJson}
            setRawConfigJson={setRawConfigJson}
            bodyError={bodyError}
          />
        )}
        {selectedTarget.id.startsWith('http') && (
          <HttpEndpointConfiguration
            selectedTarget={selectedTarget}
            updateCustomTarget={updateCustomTarget}
            bodyError={bodyError}
            setBodyError={setBodyError}
            urlError={urlError}
            setUrlError={setUrlError}
            updateFullTarget={setSelectedTarget}
          />
        )}
        {selectedTarget.id.startsWith('websocket') && (
          <WebSocketEndpointConfiguration
            selectedTarget={selectedTarget}
            updateWebSocketTarget={updateWebSocketTarget}
            urlError={urlError}
          />
        )}
        {selectedTarget.id.startsWith('browser') && (
          <BrowserAutomationConfiguration
            selectedTarget={selectedTarget}
            updateCustomTarget={updateCustomTarget}
          />
        )}
      </Box>
      <Typography variant="h6" sx={{color:'white'}} gutterBottom>
        Additional Configuration
      </Typography>
      <CommonConfigurationOptions
        selectedTarget={selectedTarget}
        updateCustomTarget={updateCustomTarget}
        extensions={config.extensions}
        onExtensionsChange={(extensions) => updateConfig('extensions', extensions)}
        onValidationChange={(hasErrors) => {
          setMissingFields((prev) =>
            hasErrors
              ? [...prev.filter((f) => f !== 'Extensions'), 'Extensions']
              : prev.filter((f) => f !== 'Extensions'),
          );
        }}
      />
      {testingEnabled && (
        <TestTargetConfiguration
          testingTarget={testingTarget}
          handleTestTarget={handleTestTarget}
          selectedTarget={selectedTarget}
          testResult={testResult}
        />
      )}
      {promptRequired && <Prompts />}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          mt: 4,
          width: '100%',
          position: 'relative',
        }}
      >
        {missingFields.length > 0 && (
          <Alert
            severity="error"
            sx={{
              flexGrow: 1,
              mr: 2,
              '& .MuiAlert-message': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            <Typography variant="body2">
              Missing required fields: {missingFields.join(', ')}
            </Typography>
          </Alert>
        )}
        <Button
          variant="outlined"
          startIcon={<KeyboardArrowLeftIcon />}
          onClick={onBack}
          sx={{ px: 4, py: 1 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          endIcon={<KeyboardArrowRightIcon />}
          disabled={missingFields.length > 0}
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.primary.dark },
            '&:disabled': { backgroundColor: theme.palette.action.disabledBackground },
            px: 4,
            py: 1,
          }}
        >
          Next
        </Button>
      </Box>
    </Stack>
    </div>
  );
}
