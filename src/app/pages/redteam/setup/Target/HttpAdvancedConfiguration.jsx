  import React from 'react';
  import Editor from 'react-simple-code-editor';
  import CheckCircleIcon from '@mui/icons-material/CheckCircle';
  import ClearIcon from '@mui/icons-material/Clear';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
  import KeyIcon from '@mui/icons-material/Key';
  import UploadIcon from '@mui/icons-material/Upload';
  import VpnKeyIcon from '@mui/icons-material/VpnKey';

  import {
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormGroup,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
  } from '@mui/material';
  import { useTheme } from '@mui/material/styles';
  import dedent from 'dedent';
  // @ts-expect-error: No types available
  import { highlight, languages } from 'prismjs/components/prism-core';
  import { convertStringKeyToPem, validatePrivateKey } from '.././utils/crypto';
  import 'prismjs/themes/prism.css';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript'; // Load JavaScript syntax
  import 'prismjs/themes/prism.css'; // Theme


  const HttpAdvancedConfiguration = ({
    selectedTarget = { config : {}},
    updateCustomTarget = () => {},
    defaultRequestTransform ='',
  }) => {
    const theme = useTheme();
    const darkMode = theme.palette.mode === 'dark';
    const language = 'javascript';

    const [signatureAuthExpanded, setSignatureAuthExpanded] = React.useState(
      !!selectedTarget.config.signatureAuth
    );

    const handleSignatureAuthChange = (_event, isExpanded) => {
      setSignatureAuthExpanded(isExpanded);
    };

    return (
      <Box mt={1}>
        <Box mb={1}>
          <Typography variant="h6" gutterBottom>
            Advanced Configuration
          </Typography>
          {/* Request Transform */}
          <Accordion sx={{
            backgroundColor: '#2B1449',
            color:'white'
          }} defaultExpanded={!!selectedTarget.config.transformRequest}>
            <AccordionSummary expandIcon={<ExpandMoreIcon className='text-white' />}>
              <Box>
                <Typography variant="h6">Request Transform</Typography>
                <Typography variant="body2" color="white">
                  Modify the prompt structure before sending to the API
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Transform the prompt into a specific structure required by your API before sending.
                See{' '}
                <a
                  href="https://www.promptfoo.dev/docs/providers/http/#request-transform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  docs
                </a>{' '}
                for more information.
              </Typography>
              <Box
                sx={{
                  border: 0,
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  position: 'relative',
                  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                }}
              >
                <Editor
                  value={selectedTarget.config.transformRequest || defaultRequestTransform || ''}
                  onValueChange={(code) => updateCustomTarget('transformRequest', code)}
                  highlight={(code) =>
                    highlight(
                      code,
                      languages[language] || languages.javascript,
                      language || 'javascript'
                    )
                  }
                  padding={10}
                  placeholder={dedent`Optional: A JavaScript expression to transform the prompt before calling the API. Format as:

                    A JSON object with prompt variable: \`{ messages: [{ role: 'user', content: prompt }] }\`
                  `}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    color:'black',
                    minHeight: '100px',
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Response Transform */}
          <Accordion sx={{
            backgroundColor: '#2B1449',
            color:'white'
          }} defaultExpanded={!!selectedTarget.config.transformResponse}>
            <AccordionSummary expandIcon={<ExpandMoreIcon className='text-white'  />}>
              <Box>
                <Typography variant="h6">Response Transform</Typography>
                <Typography variant="body2" color="white">
                  Extract the completion from the API response
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Extract specific data from the HTTP response. See{' '}
                <a
                  href="https://www.promptfoo.dev/docs/providers/http/#response-transform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  docs
                </a>{' '}
                for more information.
              </Typography>
              <Box
                sx={{
                  border: 0,
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  position: 'relative',
                  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                }}
              >
                <Editor
                  value={selectedTarget.config.transformResponse || ''}
                  onValueChange={(code) => updateCustomTarget('transformResponse', code)}
                  highlight={(code) =>
                    highlight(
                      code,
                      languages[language] || languages.javascript,
                      language || 'javascript'
                    )
                  }
                  padding={10}
                  placeholder={dedent`Optional: Transform the API response before using it. Format as either:
  1. A JavaScript object path: \`json.choices[0].message.content\`
  2. A function that receives response data: \`(json, text) => json.choices[0].message.content || text\`

  With guardrails: { output: json.choices[0].message.content, guardrails: { flagged: context.response.status === 500 } }`}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    color:'black',
                    fontSize: 14,
                    minHeight: '100px',
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Sessions */}
          <Accordion sx={{
            backgroundColor: '#2B1449',
            color:'white'
          }} defaultExpanded={!!selectedTarget.config.sessionParser}>
            <AccordionSummary expandIcon={<ExpandMoreIcon className='text-white'  />}>
              <Box>
                <Typography variant="h6">Sessions</Typography>
                <Typography variant="body2" color="white">
                  Handle stateful API sessions
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Extract session IDs from HTTP response headers or the body for stateful systems. See{' '}
                <a
                  href="https://www.promptfoo.dev/docs/providers/http/#session-management"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  docs
                </a>{' '}
                for more information.
              </Typography>
              <Stack spacing={2}>
                <FormControl>
                  <RadioGroup
                    value={selectedTarget.config.sessionSource || 'server'}
                    onChange={(e) => {
                      updateCustomTarget('sessionSource', e.target.value);
                      if (e.target.value === 'client') {
                        updateCustomTarget('sessionParser', undefined);
                      }
                    }}
                  >
                    <FormControlLabel
                      value="server"
                      control={<Radio/>}
                      label="Server-generated Session ID"
                    />
                    <FormControlLabel
                      value="client"
                      control={<Radio />}
                      label="Client-generated Session ID"
                    />
                  </RadioGroup>
                </FormControl>
                {selectedTarget.config.sessionSource === 'server' ||
                selectedTarget.config.sessionSource == null ? (
                  <TextField
                    className='!text-white'
                    fullWidth
                    label="Session Parser"
                    value={selectedTarget.config.sessionParser}
                    placeholder="Optional: Enter a Javascript expression to extract the session ID"
                    onChange={(e) => updateCustomTarget('sessionParser', e.target.value)}
                    slotProps={{
                      input : {
                        color: 'white'
                      }
                    }}
                    margin="normal"
                    sx={{
                      color:'white'
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ) : (
                  <Alert severity="info">
                    A UUID will be created for each conversation and stored in the `sessionId`
                    variable. Add {'{{'}sessionId{'}}'} in the header or body of the request above.
                  </Alert>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Digital Signature Authentication */}
          <Accordion sx={{
            backgroundColor: '#2B1449',
            color:'white'
          }} expanded={signatureAuthExpanded} onChange={handleSignatureAuthChange}>
            <AccordionSummary expandIcon={<ExpandMoreIcon className='text-white'  />}>
              <Box>
                <Typography variant="h6">Digital Signature Authentication</Typography>
                <Typography variant="body2" color="white">
                  Sign requests sent to the API
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Configure signature-based authentication for secure API calls. Your private key is
                never sent to Promptfoo and will always be stored locally on your system. See{' '}
                <a
                  href="https://www.promptfoo.dev/docs/providers/http/#digital-signature-authentication"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  docs
                </a>{' '}
                for more information.
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!selectedTarget.config.signatureAuth?.enabled}
                      onChange={(event) => {
                        if (event.target.checked) {
                          updateCustomTarget('signatureAuth', {
                            enabled: true,
                            keyInputType:
                              selectedTarget.config.signatureAuth?.keyInputType || 'upload',
                          });
                        } else {
                          updateCustomTarget('signatureAuth', undefined);
                        }
                      }}
                    />
                  }
                  label="Enable signature authentication"
                />
              </FormGroup>
              {selectedTarget.config.signatureAuth?.enabled && (
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Key Input Method
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                      {/* Upload Key */}
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          bgcolor:
                            selectedTarget.config.signatureAuth?.keyInputType === 'upload'
                              ? '#22103B'
                              : '#22103B',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() =>
                          updateCustomTarget('signatureAuth', {
                            ...selectedTarget.config.signatureAuth,
                            keyInputType: 'upload',
                          })
                        }
                      >
                        <UploadIcon
                          color={
                            selectedTarget.config.signatureAuth?.keyInputType === 'upload'
                              ? 'primary'
                              : 'action'
                          }
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body1" color='white' gutterBottom>
                          Upload Key
                        </Typography>
                        <Typography variant="body2" color="gray" align="center">
                          Upload PEM file
                        </Typography>
                      </Paper>
                      {/* File Path */}
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          bgcolor:
                            selectedTarget.config.signatureAuth?.keyInputType === 'path'
                              ? '#22103B'
                              : '#22103B',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() =>
                          updateCustomTarget('signatureAuth', {
                            ...selectedTarget.config.signatureAuth,
                            keyInputType: 'path',
                          })
                        }
                      >
                        <InsertDriveFileIcon
                          color={
                            selectedTarget.config.signatureAuth?.keyInputType === 'path'
                              ? 'primary'
                              : 'action'
                          }
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body1" color='white' gutterBottom>
                          File Path
                        </Typography>
                        <Typography variant="body2" color="gray" align="center">
                          Specify key location
                        </Typography>
                      </Paper>
                      {/* Base64 Key String */}
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          bgcolor:
                            selectedTarget.config.signatureAuth?.keyInputType === 'base64'
                              ? '#22103B'
                              : '#22103B',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() =>
                          updateCustomTarget('signatureAuth', {
                            ...selectedTarget.config.signatureAuth,
                            keyInputType: 'base64',
                          })
                        }
                      >
                        <KeyIcon
                          color={
                            selectedTarget.config.signatureAuth?.keyInputType === 'base64'
                              ? 'primary'
                              : 'action'
                          }
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body1" color='white' gutterBottom>
                          Base64 Key String
                        </Typography>
                        <Typography variant="body2" color="gray" align="center">
                          Paste encoded key
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                  {/* Key Input UI */}
                  {selectedTarget.config.signatureAuth?.keyInputType === 'upload' && (
                    <Paper variant="outlined" sx={{ p: 3, bgcolor:'#22103B'}}>
                      <input
                        type="file"
                        accept=".pem,.key"
                        style={{ display: 'none' }}
                        id="private-key-upload"
                        onClick={(e) => {
                          e.target.value = '';
                        }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              try {
                                const content = event.target.result;
                                updateCustomTarget('signatureAuth', {
                                  ...selectedTarget.config.signatureAuth,
                                  privateKey: content,
                                  privateKeyPath: undefined,
                                });
                                await validatePrivateKey(content);
                                // Optionally show success toast
                              } catch (error) {
                                // Optionally show warning toast
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <Box sx={{ textAlign: 'center' }}>
                        {selectedTarget.config.signatureAuth?.privateKey ? (
                          <>
                            <Typography color="success.main" gutterBottom>
                              Key file loaded successfully
                            </Typography>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<ClearIcon />}
                              onClick={() =>
                                updateCustomTarget('signatureAuth', {
                                  ...selectedTarget.config.signatureAuth,
                                  privateKey: undefined,
                                  privateKeyPath: undefined,
                                })
                              }
                            >
                              Remove Key
                            </Button>
                          </>
                        ) : (
                          <>
                            <Typography gutterBottom color="white">
                              Upload your PEM format private key
                            </Typography>
                            <label htmlFor="private-key-upload">
                              <Button variant="outlined" component="span" startIcon={<VpnKeyIcon />}>
                                Choose File
                              </Button>
                            </label>
                          </>
                        )}
                      </Box>
                    </Paper>
                  )}
                  {selectedTarget.config.signatureAuth?.keyInputType === 'path' && (
                    <Paper variant="outlined" sx={{ p: 3, bgcolor:"#22103B"}}>
                      <Typography gutterBottom color="white">
                        Specify the path on disk to your PEM format private key file
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="/path/to/private_key.pem"
                        value={selectedTarget.config.signatureAuth?.privateKeyPath || ''}
                        onChange={(e) => {
                                                updateCustomTarget('signatureAuth', {
                                                  ...selectedTarget.config.signatureAuth,
                                                  privateKeyPath: e.target.value,
                                                  privateKey: undefined,
                                                });
                                              }}
                        sx={{
                          input: { color: 'white' }, // input text color
                          '& .MuiInputLabel-root': { color: 'white' }, // label color
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'white' }, // border color
                            '&:hover fieldset': { borderColor: 'white' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                          },
                        }}
                      />

                    </Paper>
                  )}
                  {selectedTarget.config.signatureAuth?.keyInputType === 'base64' && (
                    <Paper variant="outlined" sx={{ p: 3, bgcolor:'#22103B'}}>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth

                          multiline
                          sx={
                            {
                          input: { color: 'white' }, // input text color
                          '& .MuiInputLabel-root': { color: 'white' }, // label color
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'white' }, // border color
                            '&:hover fieldset': { borderColor: 'white' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                          },
                        }}
                          rows={4}
                          placeholder="-----BEGIN PRIVATE KEY-----&#10;Base64 encoded key content in PEM format&#10;-----END PRIVATE KEY-----"
                          value={selectedTarget.config.signatureAuth?.privateKey || ''}
                          onChange={(e) => {
                            updateCustomTarget('signatureAuth', {
                              ...selectedTarget.config.signatureAuth,
                              privateKey: e.target.value,
                              privateKeyPath: undefined,
                            });
                          }}
                        />
                        <Box sx={{ textAlign: 'center' }}>
                          <Button
                            variant="outlined"
                            startIcon={<CheckCircleIcon />}
                            onClick={async () => {
                              try {
                                const inputKey = selectedTarget.config.signatureAuth?.privateKey || '';
                                const formattedKey = convertStringKeyToPem(inputKey);
                                updateCustomTarget('signatureAuth', {
                                  ...selectedTarget.config.signatureAuth,
                                  privateKey: formattedKey,
                                  privateKeyPath: undefined,
                                });
                                await validatePrivateKey(formattedKey);
                                // Optionally show success toast
                              } catch (error) {
                                // Optionally show warning toast
                              }
                            }}
                          >
                            Format & Validate
                          </Button>
                        </Box>
                      </Stack>
                    </Paper>
                  )}
                  {/* Signature Options */}
                  <TextField
                  
                    fullWidth
                    label="Signature Data Template"
                    value={
                      selectedTarget.config.signatureAuth?.signatureDataTemplate ||
                      '{{signatureTimestamp}}'
                    }
                    sx={
                            {
                          input: { color: 'white' }, // input text color
                          '& .MuiInputLabel-root': { color: 'white' }, // label color
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'white' }, // border color
                            '&:hover fieldset': { borderColor: 'white' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                          },
                        }}
                    onChange={(e) =>
                      updateCustomTarget('signatureAuth', {
                        ...selectedTarget.config.signatureAuth,
                        signatureDataTemplate: e.target.value,
                      })
                    }
                    placeholder="Template for generating signature data"
                    helperText="Supported variables: {{signatureTimestamp}}. Use \n for newlines"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Signature Validity (ms)"
                    type="number"
                    sx={
                            {
                          input: { color: 'white' }, // input text color
                          '& .MuiInputLabel-root': { color: 'white' }, // label color
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'white' }, // border color
                            '&:hover fieldset': { borderColor: 'white' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                          },
                        }}
                    value={selectedTarget.config.signatureAuth?.signatureValidityMs || '300000'}
                    onChange={(e) =>
                      updateCustomTarget('signatureAuth', {
                        ...selectedTarget.config.signatureAuth,
                        signatureValidityMs: Number.parseInt(e.target.value),
                      })
                    }
                    placeholder="How long the signature remains valid"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    fullWidth
                  
                    label="Signature Refresh Buffer (ms)"
                    type="number"
                    slotProps={{
                      inputLabel:{
                        color:'white'
                      }
                    }}
                    sx={
                            {
                          input: { color: 'white' }, // input text color
                          '& .MuiInputLabel-root': { color: 'white' }, // label color
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'white' }, // border color
                            '&:hover fieldset': { borderColor: 'white' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                          },
                          
                        }}
                    value={selectedTarget.config.signatureAuth?.signatureRefreshBufferMs}
                    onChange={(e) =>
                      updateCustomTarget('signatureAuth', {
                        ...selectedTarget.config.signatureAuth,
                        signatureRefreshBufferMs: Number.parseInt(e.target.value),
                      })
                    }
                    placeholder="Buffer time before signature expiry to refresh - defaults to 10% of signature validity"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Signature Algorithm"
                    sx={
                            {
                          input: { color: 'white' }, // input text color
                          '& .MuiInputLabel-root': { color: 'white' }, // label color
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'white' }, // border color
                            '&:hover fieldset': { borderColor: 'white' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                          },
                        }}
                    value={selectedTarget.config.signatureAuth?.signatureAlgorithm || 'SHA256'}
                    onChange={(e) =>
                      updateCustomTarget('signatureAuth', {
                        ...selectedTarget.config.signatureAuth,
                        signatureAlgorithm: e.target.value,
                      })
                    }
                    placeholder="Signature algorithm (default: SHA256)"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>

          {/* HTTP Status Code */}
          <Accordion sx={{
            backgroundColor: '#2B1449',
            color:'white'
          }} defaultExpanded={!!selectedTarget.config.validateStatus}>
            <AccordionSummary expandIcon={<ExpandMoreIcon className='text-white' />}>
              <Box>
                <Typography variant="h6">HTTP Status Code</Typography>
                <Typography variant="body2" color="white">
                  Configure which response codes are considered successful
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 2}}>
                Customize which HTTP status codes are treated as successful responses. By default
                accepts 200-299. See{' '}
                <a
                  href="https://www.promptfoo.dev/docs/providers/http/#error-handling"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  docs
                </a>{' '}
                for more details.
              </Typography>
              <Box
                sx={{
                  border: 0,
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  position: 'relative',
                  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                }}
              >
                <Editor
                  value={selectedTarget.config.validateStatus || ''}
                  onValueChange={(code) => updateCustomTarget('validateStatus', code)}
                  highlight={(code) => highlight(code, languages.javascript)}
                  padding={10}
                  
                  placeholder={dedent`Customize HTTP status code validation. Examples:

    () => true                     // Default: accept all responses - Javascript function
    status >= 200 && status < 300  // Accept only 2xx codes - Javascript expression
    (status) => status < 500       // Accept anything but server errors - Javascript function`}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    color:'black',
                    minHeight: '106px',
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    );
  };

  export default HttpAdvancedConfiguration;
