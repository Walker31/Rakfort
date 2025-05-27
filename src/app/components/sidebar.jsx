import {
  Box,
  Button,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  Apps as AppIcon,
  Extension as PluginIcon,
  FolderOpen as FolderOpenIcon,
  GpsFixed as TargetIcon,
  Psychology as StrategyIcon,
  RateReview as ReviewIcon,
  RestartAlt as RestartAltIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import clsx from 'clsx';
import { useUIStore } from '../store/uiStore';

// NavLink component for evals sidebar
function NavLink({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Button
      component={Link}
      to={to}
      fullWidth
      className={clsx(
        'justify-start text-left px-4 py-3 text-sm font-medium',
        isActive
          ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      {label}
    </Button>
  );
}

export default function Sidebar({
  configName,
  configDate,
  hasUnsavedChanges,
  onSave,
  onOpenSave,
  onOpenLoad,
  onOpenReset,
  pluginsCount,
  strategiesCount,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.toggleSidebar);

  // Determine active section
  const isRedteam = location.pathname.startsWith('/redteam');
  const isEvals = location.pathname.startsWith('/evals') || location.pathname.startsWith('/eval');

  // Redteam Tabs
  const redteamTabs = [
    { label: 'Usage Details', icon: <AppIcon />, path: '/redteam/setup' },
    { label: 'Targets', icon: <TargetIcon />, path: '/redteam/setup/target' },
    {
      label: `Plugins${pluginsCount ? ` (${pluginsCount})` : ''}`,
      icon: <PluginIcon />,
      path: '/redteam/setup/plugin',
    },
    {
      label: `Strategies${strategiesCount ? ` (${strategiesCount})` : ''}`,
      icon: <StrategyIcon />,
      path: '/redteam/setup/strategies',
    },
    { label: 'Review', icon: <ReviewIcon />, path: '/redteam/setup/review' },
  ];

  const evalsLinks = [
    { label: 'Prompts', path: '/evals/prompts' },
    { label: 'Datasets', path: '/evals/datasets' },
    { label: 'History', path: '/evals/history' },
  ];

  // Dynamically determine the current redteam tab index
  const currentTabIndex = redteamTabs.findIndex(tab => location.pathname.startsWith(tab.path));

  const handleTabChange = (_, newValue) => {
    navigate(redteamTabs[newValue].path);
  };

  if (!isSidebarOpen) return null;

  return (
    <Box
      className={clsx(
        'fixed top-24 right-6 w-[300px] max-h-[80vh] z-50 transition-all duration-500 shadow-xl rounded-2xl border',
        'bg-white/70 dark:bg-[#1c1c28]/60 backdrop-blur-lg',
        'border-gray-300 dark:border-white/10 flex flex-col overflow-hidden'
      )}
    >
      {/* Header */}
      <Box className="p-4 border-b border-gray-300 dark:border-white/10 relative">
        <Typography
          variant="subtitle2"
          className="font-semibold text-gray-900 dark:text-white text-center"
        >
          {configName ? `Config: ${configName}` : 'New Configuration'}
        </Typography>
        <IconButton
          onClick={closeSidebar}
          size="small"
          className="!absolute top-2 right-2 text-gray-700 dark:!text-gray-300"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Save warning or last saved timestamp */}
      {hasUnsavedChanges ? (
        <div className="px-4 py-2 text-sm text-yellow-900 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="text-lg">●</span> Unsaved changes
            </span>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={onSave}
              disabled={!configName}
              className="!py-1 !px-2 !text-xs"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        configDate && (
          <div className="px-4 py-2 text-[0.75rem] text-gray-700 dark:text-gray-400">
            Last saved: {new Date(configDate).toLocaleString()}
          </div>
        )
      )}

      <Divider />

      {/* Main Content - Tabs or Links */}
      <Box className="flex-1 overflow-y-auto">
        {isRedteam ? (
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={currentTabIndex === -1 ? 0 : currentTabIndex}
            onChange={handleTabChange}
            className="w-full"
          >
            {redteamTabs.map(({ label, icon }) => (
              <Tab
                key={label}
                icon={icon}
                label={label}
                className="!justify-start !text-left !min-h-12 px-4 dark:!text-white text-gray-800 border-b border-gray-200 dark:border-white/10"
              />
            ))}
          </Tabs>
        ) : isEvals ? (
          evalsLinks.map(({ label, path }) => (
            <NavLink key={path} to={path} label={label} />
          ))
        ) : (
          <Typography className="p-4 text-center text-gray-500 dark:text-gray-400">
            No navigation available for this section.
          </Typography>
        )}
      </Box>

      {/* Footer Actions */}
      <Divider />
      <Box className="shrink-0 flex flex-col gap-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-md border-t border-gray-200 dark:border-white/10">
        <Button
          variant="text"
          fullWidth
          startIcon={<SaveIcon className="text-gray-600 dark:text-gray-200" />}
          onClick={onOpenSave}
          className="justify-start text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="text-gray-700 dark:text-gray-200">Save Config</span>
        </Button>
        <Button
          variant="text"
          fullWidth
          startIcon={<FolderOpenIcon className="text-gray-600 dark:text-gray-200" />}
          onClick={onOpenLoad}
          className="justify-start text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="text-gray-700 dark:text-gray-200">Load Config</span>
        </Button>
        <Button
          variant="text"
          fullWidth
          startIcon={<RestartAltIcon className="text-gray-600 dark:text-gray-200" />}
          onClick={onOpenReset}
          className="justify-start text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="text-gray-700 dark:text-gray-200">Reset Config</span>
        </Button>
      </Box>
    </Box>
  );
}