import { Box, Button, Tabs, Tab, Typography } from '@mui/material';
import {
  Apps as AppIcon,
  Extension as PluginIcon,
  FolderOpen as FolderOpenIcon,
  GpsFixed as TargetIcon,
  Psychology as StrategyIcon,
  RateReview as ReviewIcon,
  RestartAlt as RestartAltIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

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

  const tabRoutes = [
    '/redteam/setup',
    '/redteam/setup/target',
    '/redteam/setup/plugin',
    '/redteam/setup/strategies',
    '/redteam/setup/review',
  ];

  const currentTabIndex = tabRoutes.findIndex(path => location.pathname.startsWith(path));

  const handleTabChange = (_, newValue) => {
    navigate(tabRoutes[newValue]);
  };

  return (
    <Box style={{ height: 'calc(100vh - 64px)' }} className="flex flex-col w-[280px] min-w-[280px] border-r border-gray-200 bg-white dark:bg-gray-900 overflow-hidden">
      <Box className="p-4 border-b border-t border-gray-200 bg-gray-100 dark:bg-[#271243] shrink-0">
        <Typography className="font-medium text-base text-gray-600 dark:text-gray-100 mb-1 text-center">
          {configName ? Config: ${configName} : 'New Configuration'}
        </Typography>
        {hasUnsavedChanges ? (
          <div className="flex items-center justify-between gap-2">
            <Typography className="text-sm text-yellow-600 flex items-center gap-1">
              <span className="text-lg">●</span> Unsaved changes
            </Typography>
            <Button size="small" variant="outlined" color="warning" onClick={onSave} disabled={!configName} className="!py-1 !px-2">
              Save now
            </Button>
          </div>
        ) : (
          configDate && <Typography className="text-sm text-gray-500">{new Date(configDate).toLocaleString()}</Typography>
        )}
      </Box>

      <Box className="flex-1 bg-gray-100 dark:bg-[#271243]">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={currentTabIndex === -1 ? 0 : currentTabIndex}
          onChange={handleTabChange}
          className="w-full"
        >
          <Tab icon={<AppIcon className="dark:text-white" />} label="Usage Details" className="!justify-start !text-left dark:!text-white !min-h-12 border-b border-gray-100" />
          <Tab icon={<TargetIcon className="dark:text-white" />} label="Targets" className="!justify-start !text-left dark:!text-white !min-h-12 border-b border-gray-100" />
          <Tab icon={<PluginIcon className="dark:text-white" />} label={Plugins${pluginsCount ?  (${pluginsCount}) : ''}} className="!justify-start !text-left dark:!text-white !min-h-12 border-b border-gray-100" />
          <Tab icon={<StrategyIcon className="dark:text-white" />} label={Strategies${strategiesCount ?  (${strategiesCount}) : ''}} className="!justify-start !text-left dark:!text-white !min-h-12 border-b border-gray-100" />
          <Tab icon={<ReviewIcon className="dark:text-white" />} label="Review" className="!justify-start !text-left dark:!text-white !min-h-12 border-b border-gray-100" />
        </Tabs>
      </Box>

      <Box className="shrink-0 flex flex-col gap-2 p-4 border-t border-gray-200 bg-gray-100 dark:bg-[#271243]">
        <Button variant="text" fullWidth startIcon={<SaveIcon className="text-gray-600 dark:text-gray-200" />} onClick={onOpenSave} className="justify-start text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="text-gray-600 dark:text-gray-200">Save Config</span>
        </Button>
        <Button variant="text" fullWidth startIcon={<FolderOpenIcon className="text-gray-600 dark:text-gray-200" />} onClick={onOpenLoad} className="justify-start text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="text-gray-600 dark:text-gray-200">Load Config</span>
        </Button>
        <Button variant="text" fullWidth startIcon={<RestartAltIcon className="text-gray-600 dark:text-gray-200" />} onClick={onOpenReset} className="justify-start text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="text-gray-600 dark:text-gray-200">Reset Config</span>
        </Button>
      </Box>
    </Box>
  );
}
