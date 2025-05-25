import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Link } from '@mui/material';

const CustomTargetConfiguration = ({
  selectedTarget,
  updateCustomTarget,
  rawConfigJson,
  setRawConfigJson,
  bodyError,
}) => {
  const [targetId, setTargetId] = useState(selectedTarget.id || '');

  useEffect(() => {
    setTargetId(selectedTarget.id || '');
  }, [selectedTarget.id]);

  const handleTargetIdChange = (e) => {
    const newId = e.target.value;
    setTargetId(newId);
    updateCustomTarget('id', newId);
  };

  return (
    <Box className="mt-4">
      {/* Section Title */}
      <Typography
        variant="h6"
        className="font-semibold text-gray-900 dark:text-white mb-2"
      >
        Custom Target Configuration
      </Typography>

      {/* Configuration Panel */}
      <Box className="mt-4 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#2B1449]">

        {/* Target ID */}
        <TextField
          fullWidth
          label="Target ID"
          value={targetId}
          onChange={handleTargetIdChange}
          required
          placeholder="e.g., openai:chat:gpt-4o"
          margin="normal"
          className="dark:[&_.MuiInputBase-root]:bg-[#3d2070] dark:[&_.MuiInputBase-root]:text-white dark:[&_.MuiOutlinedInput-notchedOutline]:border-purple-800 dark:[&_.MuiInputLabel-root]:text-white dark:[&_.MuiFormHelperText-root]:text-gray-400"
          slotProps={{
            input: {
              className: 'dark:!text-white dark:placeholder-white',
            },
            inputLabel: {
              className: 'dark:!text-white',
            },
          }}
          helperText={
            <span className="text-sm text-gray-700 dark:text-gray-400">
              The configuration string for your custom target. See{' '}
              <Link
                href="https://www.promptfoo.dev/docs/red-team/configuration/#custom-providerstargets"
                target="_blank"
                rel="noopener"
                className="underline text-blue-600 dark:text-purple-400"
              >
                Custom Targets documentation
              </Link>{' '}
              for more information.
            </span>
          }
        />


        {/* JSON Field Label */}
        <Typography
          variant="subtitle1"
          className="text-gray-800 dark:text-gray-200 mt-6 mb-2 font-medium"
        >
          Custom Configuration
        </Typography>

        {/* JSON Config */}
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={10}
          label="Configuration (JSON)"
          value={rawConfigJson}
          onChange={(e) => {
            setRawConfigJson(e.target.value);
            try {
              const config = JSON.parse(e.target.value);
              updateCustomTarget('config', config);
            } catch (_) {
              // Do nothing for now
            }
          }}
          margin="normal"
          required
          error={!!bodyError}
          helperText={
            <span className="text-sm text-gray-700 dark:text-gray-400">
              {bodyError || 'Enter your custom configuration as JSON'}
            </span>
          }
          className="dark:[&_.MuiInputBase-root]:bg-[#3d2070] dark:[&_.MuiInputBase-root]:text-white dark:[&_.MuiOutlinedInput-notchedOutline]:border-purple-800 dark:[&_.MuiInputLabel-root]:text-white dark:[&_.MuiFormHelperText-root]:text-gray-400"
          slotProps={{
            input: {
              className: 'dark:!text-white dark:placeholder-white font-mono text-sm',
            },
            inputLabel: {
              className: 'dark:!text-white',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomTargetConfiguration;
