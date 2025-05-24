import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import {
  Box, TextField, IconButton, Tooltip, Typography,
  Accordion, AccordionSummary, AccordionDetails, Link
} from '@mui/material';

const FILE_PROTOCOL_PREFIX = 'file://';

// ✅ Define missing helper
const isJavascriptFile = (filename) => {
  return (
    filename.endsWith('.js') ||
    filename.endsWith('.jsx') ||
    filename.endsWith('.ts') ||
    filename.endsWith('.tsx')
  );
};

const validatePath = (value, isTyping) => {
  if (!value) return undefined;
  if (!value.trim()) return undefined;
  const withoutPrefix = value.replace(FILE_PROTOCOL_PREFIX, '');
  const [filePath, functionName] = withoutPrefix.split(':');
  if (isTyping && !value.includes(':')) return undefined;
  if (!filePath || !functionName) return { message: 'Format: /path/to/file.js:hookFunction' };
  if (!isTyping && !isJavascriptFile(filePath) && !filePath.endsWith('.py')) {
    return { message: 'Must be a JavaScript/TypeScript or Python file' };
  }
  return undefined;
};

const ExtensionEditor = ({ extensions, onExtensionsChange, onValidationChange }) => {
  const [isTyping, setIsTyping] = React.useState(false);
  const typingTimeoutRef = React.useRef();

  const error = React.useMemo(() => validatePath(extensions[0], isTyping), [extensions, isTyping]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);
    const validationResult = validatePath(newValue, true);
    onValidationChange?.(!!validationResult);
    onExtensionsChange([`${FILE_PROTOCOL_PREFIX}${newValue}`]);
  };

  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <Accordion defaultExpanded={!!extensions.length}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Extension Hook</Typography>
            <Tooltip title={
              <Box>
                <Typography variant="body2" paragraph>
                  Run custom code at these lifecycle points:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: '1.2em' }}>
                  <li>beforeAll - Start of test suite</li>
                  <li>afterAll - End of test suite</li>
                  <li>beforeEach - Before each test</li>
                  <li>afterEach - After each test</li>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Link
                    href="https://www.promptfoo.dev/docs/configuration/reference/#extension-hooks"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="always"
                  >
                    View documentation
                  </Link>
                </Box>
              </Box>
            }>
              <IconButton size="small">
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {extensions.length > 0
              ? extensions[0]
              : 'Add custom code to run at specific points in the evaluation lifecycle'}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body1" sx={{ mb: 2 }}>
          See{' '}
          <Link
            href="https://www.promptfoo.dev/docs/configuration/reference/#extension-hooks"
            target="_blank"
            rel="noopener"
          >
            docs
          </Link>{' '}
          for more details.
        </Typography>
        <Box>
          <TextField
            fullWidth
            size="small"
            placeholder="/path/to/hook.js:extensionHook"
            value={extensions[0]?.replace(FILE_PROTOCOL_PREFIX, '')}
            onChange={handleChange}
            error={!!error}
            helperText={error?.message}
            InputProps={{
              startAdornment: (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1, userSelect: 'none' }}
                >
                  file://
                </Typography>
              ),
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExtensionEditor;
