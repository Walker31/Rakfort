import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';

export default function PluginConfigDialog({
  open,
  plugin,
  config,
  onClose,
  onSave,
}) {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    if (open && plugin && (!localConfig || Object.keys(localConfig).length === 0)) {
      setLocalConfig(config || {});
    }
  }, [open, plugin, config]);

  const handleArrayInputChange = (key, index, value) => {
    setLocalConfig((prev) => {
      const currentArray = Array.isArray(prev[key]) ? [...prev[key]] : [''];
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
      [key]: [...(Array.isArray(prev[key]) ? prev[key] : []), ''],
    }));
  };

  const removeArrayItem = (key, index) => {
    setLocalConfig((prev) => {
      const currentArray = Array.isArray(prev[key]) ? [...prev[key]] : [''];
      currentArray.splice(index, 1);
      if (currentArray.length === 0) currentArray.push('');
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
    if (!plugin) return null;

    switch (plugin) {
      case 'policy':
      case 'prompt-extraction': {
        const key = plugin === 'policy' ? 'policy' : 'systemPrompt';
        return (
          <TextField
            className="mt-4"
            fullWidth
            multiline
            rows={4}
            label={plugin === 'policy' ? 'Policy' : 'System Prompt'}
            variant="outlined"
            value={localConfig[key] || ''}
            onChange={(e) =>
              setLocalConfig({ ...localConfig, [key]: e.target.value })
            }
          />
        );
      }

      case 'bfla':
      case 'bola':
      case 'ssrf': {
        const arrayKey =
          plugin === 'bfla'
            ? 'targetIdentifiers'
            : plugin === 'bola'
            ? 'targetSystems'
            : 'targetUrls';

        const currentArray = localConfig[arrayKey] || [''];

        return (
          <div className="flex flex-col space-y-2 mt-4">
            {currentArray.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 w-full"
              >
                <TextField
                  fullWidth
                  label={`${arrayKey} ${index + 1}`}
                  variant="outlined"
                  value={item}
                  onChange={(e) =>
                    handleArrayInputChange(arrayKey, index, e.target.value)
                  }
                />
                {currentArray.length > 1 && (
                  <IconButton
                    onClick={() => removeArrayItem(arrayKey, index)}
                    size="small"
                    className="text-red-500 hover:text-red-700"
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </div>
            ))}
            <div>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addArrayItem(arrayKey)}
                variant="outlined"
                size="small"
                disabled={hasEmptyArrayItems(currentArray)}
                className="mt-2"
              >
                Add
              </Button>
            </div>
          </div>
        );
      }

      case 'indirect-prompt-injection':
        return (
          <TextField
            className="mt-4"
            fullWidth
            label="Indirect Injection Variable"
            variant="outlined"
            value={localConfig.indirectInjectionVar || ''}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                indirectInjectionVar: e.target.value,
              })
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
      <DialogTitle className="font-bold text-xl text-gray-800">
        Configure {plugin}
      </DialogTitle>
      <DialogContent className="pt-2">{renderConfigInputs()}</DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button onClick={onClose} className="text-gray-600">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
