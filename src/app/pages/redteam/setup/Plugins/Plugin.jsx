import { useState, useMemo, useCallback, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useDebounce } from 'use-debounce';
import { useRedTeamConfig, useRecentlyUsedPlugins } from '../hooks/useRedTeamConfig';
import CustomIntentSection from './CustomIntentPluginSection';
import PluginConfigDialog from './PluginConfigDialog';
import PresetCard from './PresetCard';
import { CustomPoliciesSection } from '../Target/CustomPoliciesSection';

import {
  ALL_PLUGINS,
  categoryAliases,
  HARM_PLUGINS,
  DEFAULT_PLUGINS,
  FOUNDATION_PLUGINS,
  NIST_AI_RMF_MAPPING,
  OWASP_LLM_RED_TEAM_MAPPING,
  OWASP_API_TOP_10_MAPPING,
  OWASP_LLM_TOP_10_MAPPING,
  MITRE_ATLAS_MAPPING,
  PLUGIN_PRESET_DESCRIPTIONS,
  riskCategories,
  displayNameOverrides,
  subCategoryDescriptions,
} from './constants';

const PLUGINS_REQUIRING_CONFIG = ['indirect-prompt-injection', 'prompt-extraction'];
const PLUGINS_SUPPORTING_CONFIG = ['bfla', 'bola', 'ssrf', ...PLUGINS_REQUIRING_CONFIG];

function ErrorFallback({ error }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 rounded">
      <p className="font-bold">Something went wrong:</p>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
    </div>
  );
}

export default function Plugins({ onNext, onBack }) {
  const { config, updatePlugins } = useRedTeamConfig();
  const { plugins: recentlyUsedPlugins, addPlugin } = useRecentlyUsedPlugins();

  const [isCustomMode, setIsCustomMode] = useState(true);
  const [recentlyUsedSnapshot] = useState(() => [...recentlyUsedPlugins]);
  const [selectedPlugins, setSelectedPlugins] = useState(() => {
    return new Set(
      config.plugins.map((plugin) => (typeof plugin === 'string' ? plugin : plugin.id))
    );
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [pluginConfig, setPluginConfig] = useState(() => {
    const initialConfig = {};
    config.plugins.forEach((plugin) => {
      if (typeof plugin === 'object' && plugin.config) {
        initialConfig[plugin.id] = plugin.config;
      }
    });
    return initialConfig;
  });
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedConfigPlugin, setSelectedConfigPlugin] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const [debouncedPlugins] = useDebounce(
    useMemo(
      () =>
        Array.from(selectedPlugins)
          .map((plugin) => {
            if (plugin === 'policy') return null;
            const config = pluginConfig[plugin];
            if (config && Object.keys(config).length > 0) {
              return { id: plugin, config };
            }
            return plugin;
          })
          .filter((plugin) => plugin !== null),
      [selectedPlugins, pluginConfig]
    ),
    1000
  );

  useEffect(() => {
    if (debouncedPlugins) {
      updatePlugins(debouncedPlugins);
    }
  }, [debouncedPlugins, updatePlugins]);

  const handlePluginToggle = useCallback(
    (plugin) => {
      setSelectedPlugins((prev) => {
        const newSet = new Set(prev);

        if (plugin === 'policy') {
          if (newSet.has(plugin)) {
            newSet.delete(plugin);
            setPluginConfig((prevConfig) => {
              const newConfig = { ...prevConfig };
              delete newConfig[plugin];
              return newConfig;
            });
          } else {
            newSet.add(plugin);
          }
          return newSet;
        }

        if (newSet.has(plugin)) {
          newSet.delete(plugin);
          setPluginConfig((prevConfig) => {
            const newConfig = { ...prevConfig };
            delete newConfig[plugin];
            return newConfig;
          });
        } else {
          newSet.add(plugin);
          addPlugin(plugin);
          if (PLUGINS_REQUIRING_CONFIG.includes(plugin)) {
            setSelectedConfigPlugin(plugin);
            setConfigDialogOpen(true);
          }
        }
        return newSet;
      });
    },
    [addPlugin]
  );

  const handlePresetSelect = (preset) => {
    if (preset.name === 'Custom') {
      setIsCustomMode(true);
    } else {
      setSelectedPlugins(new Set(preset.plugins));
      setIsCustomMode(false);
    }
  };

  const filteredPlugins = useMemo(() => {
    if (!searchTerm) return ALL_PLUGINS;
    return ALL_PLUGINS.filter((plugin) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        plugin.toLowerCase().includes(lowerSearchTerm) ||
        HARM_PLUGINS[plugin]?.toLowerCase().includes(lowerSearchTerm) ||
        displayNameOverrides[plugin]?.toLowerCase().includes(lowerSearchTerm) ||
        categoryAliases[plugin]?.toLowerCase().includes(lowerSearchTerm) ||
        subCategoryDescriptions[plugin]?.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [searchTerm]);

  const presets = [
    { name: 'Recommended', plugins: DEFAULT_PLUGINS },
    { name: 'Minimal Test', plugins: new Set(['harmful:hate', 'harmful:self-harm']) },
    { name: 'RAG', plugins: new Set([...DEFAULT_PLUGINS, 'bola', 'bfla', 'rbac']) },
    { name: 'Foundation', plugins: new Set(FOUNDATION_PLUGINS) },
    { name: 'NIST', plugins: new Set(Object.values(NIST_AI_RMF_MAPPING).flatMap((v) => v.plugins)) },
    { name: 'OWASP LLM Top 10', plugins: new Set(Object.values(OWASP_LLM_TOP_10_MAPPING).flatMap((v) => v.plugins)) },
    { name: 'OWASP Gen AI Red Team', plugins: new Set(Object.values(OWASP_LLM_RED_TEAM_MAPPING).flatMap((v) => v.plugins)) },
    { name: 'OWASP API Top 10', plugins: new Set(Object.values(OWASP_API_TOP_10_MAPPING).flatMap((v) => v.plugins)) },
    { name: 'MITRE', plugins: new Set(Object.values(MITRE_ATLAS_MAPPING).flatMap((v) => v.plugins)) },
  ];

  const updatePluginConfig = useCallback((plugin, newConfig) => {
    setPluginConfig((prevConfig) => {
      const currentConfig = prevConfig[plugin] || {};
      const configChanged = JSON.stringify(currentConfig) !== JSON.stringify(newConfig);

      if (!configChanged) return prevConfig;
      return {
        ...prevConfig,
        [plugin]: {
          ...currentConfig,
          ...newConfig,
        },
      };
    });
  }, []);

  const isConfigValid = useCallback(() => {
    for (const plugin of selectedPlugins) {
      if (PLUGINS_REQUIRING_CONFIG.includes(plugin)) {
        const config = pluginConfig[plugin];
        if (!config || Object.keys(config).length === 0) return false;
        for (const key in config) {
          const value = config[key];
          if (Array.isArray(value) && value.length === 0) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
        }
      }
    }
    return true;
  }, [selectedPlugins, pluginConfig]);

  const handleConfigClick = (plugin) => {
    setSelectedConfigPlugin(plugin);
    setConfigDialogOpen(true);
  };

  const isPluginConfigured = (plugin) => {
    if (!PLUGINS_REQUIRING_CONFIG.includes(plugin) || plugin === 'policy') return true;
    const config = pluginConfig[plugin];
    if (!config || Object.keys(config).length === 0) return false;
    for (const key in config) {
      const value = config[key];
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
    }
    return true;
  };

  // Use only Tailwind for all Paper, Text, and backgrounds
  const renderPluginCategory = (category, plugins) => {
    const pluginsToShow = plugins
      .filter((plugin) => plugin !== 'intent' && plugin !== 'policy')
      .filter((plugin) => filteredPlugins.includes(plugin));
    if (pluginsToShow.length === 0) return null;
    const isExpanded = expandedCategories.has(category);
    const selectedCount = pluginsToShow.filter((plugin) => selectedPlugins.has(plugin)).length;

    const getPluginCategory = (plugin) => {
      if (category !== 'Recently Used') return null;
      return Object.entries(riskCategories).find(([_, plugins]) => plugins.includes(plugin))?.[0];
    };

    return (
      <Accordion
      sx={{
        bgcolor:'#2B1449'
      }}
        key={category}
        expanded={isExpanded}
        onChange={(event, expanded) => {
          setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (expanded) newSet.add(category);
            else newSet.delete(category);
            return newSet;
          });
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:'white'}} />}>
          <div className="flex items-center w-full">
            <h2 className="text-lg font-semibold flex-1 text-gray-900 dark:text-gray-100">
              {category} <span className="font-normal text-gray-500 dark:text-gray-400">({selectedCount}/{pluginsToShow.length})</span>
            </h2>
            {isExpanded && (
              <div
                className="flex gap-4 mr-4 text-blue-600 dark:text-blue-400 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="cursor-pointer hover:underline dark:text-white"
                  onClick={() => {
                    pluginsToShow.forEach((plugin) => {
                      if (!selectedPlugins.has(plugin)) handlePluginToggle(plugin);
                    });
                  }}
                >
                  Select all
                </span>
                <span
                  className="cursor-pointer hover:underline dark:text-white"
                  onClick={() => {
                    pluginsToShow.forEach((plugin) => {
                      if (selectedPlugins.has(plugin)) handlePluginToggle(plugin);
                    });
                  }}
                >
                  Select none
                </span>
              </div>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails>
  <Grid container spacing={2}>
    {pluginsToShow.map((plugin) => {
      // Determine border color class
      const borderClass = selectedPlugins.has(plugin)
        ? PLUGINS_REQUIRING_CONFIG.includes(plugin) && !isPluginConfigured(plugin)
          ? 'border border-red-500'
          : 'border border-blue-500'
        : 'border border-transparent';

      // Determine background class
      const backgroundClass = selectedPlugins.has(plugin)
        ? 'bg-blue-50 dark:bg-blue-950'
        : 'bg-white dark:bg-gray-900';

      // Hover background class
      const hoverClass = 'hover:bg-blue-100 dark:hover:bg-gray-800';

      return (
        <Grid item xs={12} sm={6} md={4} key={plugin}>
          <Paper
            elevation={1}
            className={`
              h-full transition-all p-4
              ${borderClass}
              ${backgroundClass}
              ${hoverClass}
            `}
          >
            <div className="flex flex-col h-full relative">
              <FormControlLabel
                sx={{ flex: 1 }}
                control={
                  <Checkbox
                    checked={selectedPlugins.has(plugin)}
                    onChange={() => handlePluginToggle(plugin)}
                    color="primary"
                  />
                }
                label={
                  <div className="flex flex-col gap-1">
                    {category === 'Recently Used' && getPluginCategory(plugin) && (
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 self-start">
                        {getPluginCategory(plugin)}
                      </span>
                    )}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {displayNameOverrides[plugin] || categoryAliases[plugin] || plugin}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subCategoryDescriptions[plugin]}
                    </span>
                  </div>
                }
              />
              {selectedPlugins.has(plugin) && PLUGINS_SUPPORTING_CONFIG.includes(plugin) && (
                <IconButton
                  size="small"
                  title={
                    isPluginConfigured(plugin)
                      ? 'Edit Configuration'
                      : 'Configuration Required'
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfigClick(plugin);
                  }}
                  className={`
                    absolute top-2 right-2 opacity-70
                    ${PLUGINS_REQUIRING_CONFIG.includes(plugin) && !isPluginConfigured(plugin)
                      ? 'text-red-600 dark:text-red-400 opacity-100'
                      : 'text-blue-600 dark:text-blue-400'
                    }
                    hover:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900
                  `}
                >
                  <SettingsOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          </Paper>
        </Grid>
      );
    })}
  </Grid>
</AccordionDetails>

      </Accordion>
    );
  };

  const currentlySelectedPreset = presets.find(
    (p) =>
      Array.from(p.plugins).every((plugin) => selectedPlugins.has(plugin)) &&
      p.plugins.size === selectedPlugins.size
  );

  const selectAllPlugins = () => {
    filteredPlugins.forEach((plugin) => {
      if (!selectedPlugins.has(plugin)) handlePluginToggle(plugin);
    });
  };

  const selectNonePlugins = () => {
    filteredPlugins.forEach((plugin) => {
      if (selectedPlugins.has(plugin)) handlePluginToggle(plugin);
    });
  };

  const toggleAccordionCategory = (name, expanded) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      expanded ? newSet.add(name) : newSet.delete(name);
      return newSet;
    });
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box className="px-4 py-6 md:px-10 lg:px-24 bg-indigo-50 dark:bg-[#22103B]">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Plugin Configuration</h1>

        {/* Presets */}
        <section className="mb-10">
          <h2 className="text-2xl mb-4 font-semibold text-gray-800 dark:text-gray-200">Available Presets</h2>
          <Grid
            container
            spacing={3}
            className="mb-6"
            sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
          >
            {presets.map((preset) => {
              const isSelected =
                preset.name === 'Custom'
                  ? isCustomMode
                  : preset.name === currentlySelectedPreset?.name;
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={preset.name}
                  className="min-w-[280px] sm:min-w-[320px] max-w-full sm:max-w-[380px]"
                >
                  <PresetCard
                    name={preset.name}
                    description={PLUGIN_PRESET_DESCRIPTIONS[preset.name] || ''}
                    isSelected={isSelected}
                    onClick={() => handlePresetSelect(preset)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </section>

        {/* Filter Plugins (native input for full Tailwind control) */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter Plugins"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2B1449] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Select All / None */}
        <div className="flex justify-end gap-6 mb-4 text-blue-600 dark:text-gray-50 text-sm cursor-pointer">
          <span className="hover:underline" onClick={selectAllPlugins}>
            Select all
          </span>
          <span className="hover:underline" onClick={selectNonePlugins}>
            Select none
          </span>
        </div>

        {/* Plugin Categories */}
        <div className="mb-10 space-y-8">
          {recentlyUsedSnapshot.length > 0 &&
            renderPluginCategory('Recently Used', recentlyUsedSnapshot)}
          {Object.entries(riskCategories).map(([category, plugins]) =>
            renderPluginCategory(category, plugins)
          )}

          {/* Custom Prompts Accordion */}
          <Accordion
            expanded={expandedCategories.has('Custom Prompts')}
            onChange={(_, expanded) =>
              toggleAccordionCategory('Custom Prompts', expanded)
            }
            slotProps={
              {
                root: {
                  className:'bg-purple-50'
                }
              }
            }
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Custom Prompts (
                {config.plugins.filter(
                  (p) =>
                    typeof p === 'object' &&
                    p.id === 'intent' &&
                    'config' in p
                )[0]?.config?.intent?.length || 0}
                )
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <CustomIntentSection />
            </AccordionDetails>
          </Accordion>

          {/* Custom Policies Accordion */}
          <Accordion
            expanded={expandedCategories.has('Custom Policies')}
            onChange={(_, expanded) =>
              toggleAccordionCategory('Custom Policies', expanded)
            }
            className="!bg-gray-50 dark:!bg-[#1e1b2f] border-none"
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Custom Policies (
                {
                  config.plugins.filter(
                    (p) => typeof p === 'object' && p.id === 'policy'
                  ).length
                }
                )
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <CustomPoliciesSection />
            </AccordionDetails>
          </Accordion>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-6 mt-12">
          <Button
          component="div"
            onClick={onBack}
            className="px-6 py-2"
          >
            <div className="px-6 py-2 rounded-xl text-gray-800 dark:text-gray-100  bg-indigo-300 dark:bg-[#7904DF] hover:bg-[#6903c2] disabled:bg-gray-300"><KeyboardArrowLeftIcon /> Back</div>
          </Button>
          <div className="flex items-center gap-4">
            {selectedPlugins.size === 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Select at least one plugin to continue.
              </span>
            )}
            <Button
              component="div"
              onClick={onNext}
              disabled={!isConfigValid() || selectedPlugins.size === 0}
            >
              <div
                className="px-6 py-2 rounded-xl text-gray-800 dark:text-gray-100  bg-indigo-300 dark:bg-[#7904DF] hover:bg-[#6903c2] disabled:bg-gray-300"
              >
                Next
                <KeyboardArrowRightIcon />
              </div>
            </Button>
          </div>
        </div>

        {/* Plugin Config Dialog */}
        <PluginConfigDialog
          open={configDialogOpen}
          plugin={selectedConfigPlugin}
          config={
            selectedConfigPlugin
              ? pluginConfig[selectedConfigPlugin] || {}
              : {}
          }
          onClose={() => {
            setConfigDialogOpen(false);
            setSelectedConfigPlugin(null);
          }}
          onSave={(plugin, newConfig) => {
            updatePluginConfig(plugin, newConfig);
          }}
        />
      </Box>
    </ErrorBoundary>
  );
}
