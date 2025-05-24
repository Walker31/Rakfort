import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InfoIcon from '@mui/icons-material/Info';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import Logo from './logo';
import DarkModeToggle from './darkmode';

// --- Mock InfoModal ---
function InfoModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box p={4}>This is an info modal.</Box>
    </Dialog>
  );
}

// --- Mock API Settings Modal ---
function ApiSettingsModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box p={4}>API and Sharing Settings</Box>
    </Dialog>
  );
}

// --- Mock UI Store ---
const useUIStore = () => ({
  isNavbarVisible: true,
});

// --- Mock Environment Flag ---
const IS_RUNNING_LOCALLY = true;

// --- Styled components ---
const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover' : {
    backgroundColor: theme.palette.action.hover,
  },
  '&.active': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent', // we will use tailwind bg
  boxShadow: 'none',
}));

// --- Custom NavLink ---
function NavLink({ href, label }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={`px-3 py-1 rounded text-sm sm:text-base
        ${isActive ? 'font-bold text-white bg-gray-700 dark:bg-gray-800' : 'text-gray-300 hover:underline hover:text-gray-100'}
      `}
    >
      {label}
    </Link>
  );
}

// --- Create Dropdown ---
function CreateDropdown() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isActive = ['/setup', '/redteam/setup'].some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
    <div className='bg-gray-300 rounded-3xl dark:bg-[#22103B] '>
      <NavButton
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        className={`text-white dark:text-black
          ${isActive ? 'bg-gray-50 dark:bg-gray-800' : ''}
          hover:bg-gray-700 dark:hover:bg-gray-800
        `}
      >
        <div className='text-gray-800 dark:text-white'>
          Create
        </div>
        
      </NavButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            className: 'bg-amber-100 dark:bg-gray-800 rounded-lg shadow-lg text-black dark:text-white',
            sx: {
        mt: 1,
        borderRadius: 2,
        bgcolor: '#271243',
        color: 'white',
        boxShadow: 3,
        '& .MuiMenuItem-root': {
          px: 2,
          py: 1,
          fontSize: '0.9rem',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        },
      },
          }
        }}
      >
        <MenuItem onClick={handleClose} component={Link} to="/setup">
          Eval
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/redteam/setup">
          Redteam
        </MenuItem>
      </Menu>
      </div>
    </>
  );
}

// --- Evals Dropdown ---
function EvalsDropdown() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isActive = ['/eval', '/evals'].some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <NavButton
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        className={`text-gray-200 dark:text-gray-300
          ${isActive ? 'bg-gray-700 dark:bg-gray-800' : ''}
          hover:bg-gray-700 dark:hover:bg-gray-800
        `}
      >
        <div className='text-gray-800 dark:text-white'>
          Evals
        </div>
        
      </NavButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose} component={Link} to="/eval">
          Latest Eval
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/evals">
          All Evals
        </MenuItem>
      </Menu>
    </>
  );
}

export default function Navigation({ darkMode, onToggleDarkMode,toggleSidebar }) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showApiSettingsModal, setShowApiSettingsModal] = useState(false);
  const { isNavbarVisible } = useUIStore();

  const handleModalToggle = () => setShowInfoModal((prev) => !prev);
  const handleApiSettingsModalToggle = () => setShowApiSettingsModal((prev) => !prev);

  if (!isNavbarVisible) return null;

  return (
    <>
      <StyledAppBar
        position="static"
        elevation={0}
        className="bg-gray-100 dark:bg-[#271243] shadow-md mb-4 h-12"
      >
        <Toolbar className="px-4 py-1 flex justify-between items-center bg-gray-100 dark:bg-[#271243]">
          {/* Left: Logo + Nav Links */}

          <IconButton
            onClick={toggleSidebar}
          >
          <MenuIcon className='text-gray-700 dark:text-gray-50'/>
          </IconButton>
          <div className="flex items-center gap-4">
            <Logo />
          </div>

          <div className='flex px-4 py-1 items-center justify-between'>
            {/* <CreateDropdown />
             <EvalsDropdown />
            <NavLink href="/prompts" label="Prompts" />
            <NavLink href="/datasets" label="Datasets" />
            <NavLink href="/history" label="History" /> */}
          </div>

          {/* Right: Icons + Toggle */}
          <div className="flex items-center gap-4 ml-auto mr-2 text-gray-800 dark:text-gray-200">
            <CreateDropdown />
            <IconButton
              onClick={handleModalToggle}
              className="hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <InfoIcon className='text-gray-800 dark:text-white'/>
            </IconButton>

            {IS_RUNNING_LOCALLY && (
              <Tooltip title="API and Sharing Settings">
                <IconButton
                  onClick={handleApiSettingsModalToggle}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <EngineeringIcon className='text-gray-800 dark:text-white'/>
                </IconButton>
              </Tooltip>
            )}

            <DarkModeToggle onToggleDarkMode={onToggleDarkMode} />
          </div>
        </Toolbar>
      </StyledAppBar>

      {/* Modals */}
      <InfoModal open={showInfoModal} onClose={handleModalToggle} />
      <ApiSettingsModal open={showApiSettingsModal} onClose={handleApiSettingsModalToggle} />
    </>
  );
}