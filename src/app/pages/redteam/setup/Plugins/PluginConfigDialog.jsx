import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

export default function PluginConfigDialog({
  open,
  plugin,
  config,
  onClose,
  onSave,
}) {
  // Initialize with provided config
  const [localConfig, setLocalConfig] = useState(config);

  // Update localConfig when config prop changes
  useEffect(() => {
    if (open && plugin && (!localConfig || Object.keys(localConfig).length === 0)) {
      setLocalConfig(config || {});
    }
  }, [open, plugin, config]);

  const handleArrayInputChange = (key, index, value) => {
    setLocalConfig((prev) => {
      const currentArray = Array.isArray(prev[key]) ? [...(prev[key])] : [''];
      currentArray[index] = value;
      return {
        ...prev,
        [key]: currentArray,
      };
    });
  };

  const addArrayItem = (key) => {
    setLocalConfig((prev) => ({
      ...prev,
      [key]: [...(Array.isArray(prev[key]) ? (prev[key]) : []), ''],
    }));
  };

  const removeArrayItem = (key, index) => {
    setLocalConfig((prev) => {
      const currentArray = Array.isArray(prev[key]) ? [...(prev[key])] : [''];
      currentArray.splice(index, 1);
      if (currentArray.length === 0) {
        currentArray.push('');
      }
      return {
        ...prev,
        [key]: currentArray,
      };
    });
  };

  const hasEmptyArrayItems = (array) => {
    return array?.some((item) => item.trim() === '') ?? false;
  };

  const renderConfigInputs = () => {
    if (!plugin) {
      return null;
    }

    switch (plugin) {
      case 'policy':
      case 'prompt-extraction':
        const key = plugin === 'policy' ? 'policy' : 'systemPrompt';
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={plugin === 'policy' ? 'Policy' : 'System Prompt'}
            variant="outlined"
            margin="normal"
            value={localConfig[key] || ''}
            onChange={(e) => setLocalConfig({ ...localConfig, [key]: e.target.value })}
          />
        );
      case 'bfla':
      case 'bola':
      case 'ssrf':
        const arrayKey =
          plugin === 'bfla'
            ? 'targetIdentifiers'
            : plugin === 'bola'
              ? 'targetSystems'
              : 'targetUrls';
        // Ensure we always have at least one item
        const currentArray = (localConfig[arrayKey]) || [''];
        return (
          <>
            {currentArray.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <TextField
                  fullWidth
                  label={`${arrayKey} ${index + 1}`}
                  variant="outlined"
                  value={item}
                  onChange={(e) => handleArrayInputChange(arrayKey, index, e.target.value)}
                  sx={{ mr: 1 }}
                />
                {/* Only show remove button if there's more than one item */}
                {currentArray.length > 1 && (
                  <IconButton onClick={() => removeArrayItem(arrayKey, index)} size="small">
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => addArrayItem(arrayKey)}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              disabled={hasEmptyArrayItems(currentArray)}
            >
              Add
            </Button>
          </>
        );
      case 'indirect-prompt-injection':
        return (
          <TextField
            fullWidth
            label="Indirect Injection Variable"
            variant="outlined"
            margin="normal"
            value={localConfig.indirectInjectionVar || ''}
            onChange={(e) =>
              setLocalConfig({ ...localConfig, indirectInjectionVar: e.target.value })
            }
          />
        );
      default:
        return null;
    }
  };

  const handleSave = () => {
    if (plugin && localConfig) {
      if (JSON.stringify(config) !== JSON.stringify(localConfig)) {
        onSave(plugin, localConfig);
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure {plugin}</DialogTitle>
      <DialogContent>{renderConfigInputs()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
