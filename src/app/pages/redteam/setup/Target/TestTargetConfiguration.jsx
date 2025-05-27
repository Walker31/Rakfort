import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Button,
  CircularProgress, List, ListItem, ListItemIcon, ListItemText,
  Paper, Typography
} from '@mui/material';
import ProviderResponse from './ProviderResponse';

const TestTargetConfiguration = ({
  testingTarget,
  handleTestTarget,
  selectedTarget,
  testResult,
}) => {
  return (
    <div className="mt-8">
      {/* Header + Button */}
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6">Test Target Configuration</Typography>
        <Button
          variant="contained"
          onClick={handleTestTarget}
          disabled={testingTarget || (!selectedTarget.config.url && !selectedTarget.config.request)}
          startIcon={testingTarget ? <CircularProgress size={20} /> : null}
          color="primary"
        >
          {testingTarget ? 'Testing...' : 'Test Target'}
        </Button>
      </div>

      {/* Info Alert */}
      {!selectedTarget.config.url && !selectedTarget.config.request && (
        <Alert severity="info">
          Please configure the HTTP endpoint above and click "Test Target" to proceed.
        </Alert>
      )}

      {/* Test Result Section */}
      {testResult && (
        <div className="mt-4">
          {!testResult.unalignedProviderResult && testResult.success != null && (
            <>
              <Alert severity={testResult.success ? 'success' : 'error'}>
                {testResult.message}
              </Alert>

              {testResult.suggestions && (
                <div className="mt-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Suggestions:
                  </Typography>
                  <Paper elevation={1} className="p-4 bg-gray-100 dark:bg-gray-800">
                    <List>
                      {testResult.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <InfoIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={suggestion} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </div>
              )}
            </>
          )}

          {/* Accordion */}
          <Accordion className="mt-4" defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Provider Response Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {testResult.unalignedProviderResult && (
                <>
                  <div>
                    {testResult.unalignedProviderResult.outputs.length > 0 ? (
                      <Alert severity="info" className="mb-4">
                        The provider appears to be working properly. Review the harmful outputs below.
                      </Alert>
                    ) : (
                      <Alert severity="error">
                        We weren't able to get any harmful outputs from the provider.
                      </Alert>
                    )}

                    <Typography variant="h6" gutterBottom>
                      Harmful Outputs:
                    </Typography>

                    <Paper elevation={0} className="p-4 bg-gray-100 dark:bg-gray-800 max-h-[200px] overflow-auto mb-4">
                      <pre> - {testResult.unalignedProviderResult.outputs.join('\n - ')}</pre>
                    </Paper>
                  </div>

                  <Typography variant="h6" className="mt-10" gutterBottom>
                    When testing harmful outputs, we also do a raw request to the provider for troubleshooting.
                  </Typography>
                </>
              )}

              {testResult.redteamProviderResult && (
                <Typography variant="h6" gutterBottom>
                  Simple String Prompt "hello world"
                </Typography>
              )}

              <ProviderResponse providerResponse={testResult.providerResponse} />

              {testResult.redteamProviderResult && (
                <>
                  <Typography variant="h6" className="mt-8" gutterBottom>
                    OpenAI Formatted Prompt
                  </Typography>
                  <ProviderResponse providerResponse={testResult.redteamProviderResult} />
                </>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default TestTargetConfiguration;
