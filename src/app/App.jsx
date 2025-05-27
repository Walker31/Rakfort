import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom';
import './index.css';
import Navigation from './components/navbar.jsx';
import Sidebar from './components/sidebar.jsx';
import { Drawer } from './components/drawer.jsx';
import { useUIStore } from './store/uiStore.jsx';
import { RedTeamConfigProvider } from './contexts/redteamconfigcontext.jsx';

import Home from './pages/Home/home.jsx';
import UsageDetails from './pages/redteam/setup/usageDetails.jsx';
import Target from './pages/redteam/setup/Target/target.jsx';
import Plugins from './pages/redteam/setup/Plugins/Plugin.jsx';
import Strategies from './pages/redteam/setup/Strategies/Strategies.jsx';
import Review from './pages/redteam/setup/Review/Review.jsx';
import Dashboard from './pages/Dashboard/dashboard.jsx';

const basename = import.meta.env.VITE_PUBLIC_BASENAME || '';

function Layout() {
  const location = useLocation();

  const {
    isDrawerCollapsed,
    isSidebarOpen,
    toggleDrawer,
    toggleSidebar,
  } = useUIStore();

  const showRightSidebar =
    location.pathname.startsWith('/redteam') ||
    location.pathname.startsWith('/evals');

  return (
    <RedTeamConfigProvider>
      <div className="h-screen flex flex-col overflow-hidden dark:bg-[#22103B]">
        {/* Top Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>

        {/* Body below navbar */}
        <div className="flex flex-1 pt-[64px] h-full overflow-hidden">
          {/* Left Drawer */}
          <div className={`${isDrawerCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
            <Drawer collapsed={isDrawerCollapsed} />
          </div>

          {/* Main content area */}
          <div className="flex flex-1 h-full overflow-hidden">
            {/* Sidebar */}
            {showRightSidebar && isSidebarOpen && <Sidebar />}

            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto min-h-0">
              <div className="h-full w-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </RedTeamConfigProvider>
  );
}

function ComingSoon({ label }) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-2xl text-gray-500 dark:text-gray-300">
        {label} — Yet to be implemented
      </div>
    </div>
  );
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<ComingSoon label="Reports" />} />
        <Route path="people" element={<ComingSoon label="People" />} />
        <Route path="api-tokens" element={<ComingSoon label="API Tokens" />} />
        <Route path="redteam/setup" element={<UsageDetails />} />
        <Route path="redteam/setup/target" element={<Target />} />
        <Route path="redteam/setup/plugin" element={<Plugins />} />
        <Route path="redteam/setup/strategies" element={<Strategies />} />
        <Route path="redteam/setup/review" element={<Review />} />
        <Route path="attack-campaigns" element={<ComingSoon label="Attack Campaigns" />} />
        <Route path="scanners" element={<ComingSoon label="Scanners" />} />
        <Route path="playground" element={<ComingSoon label="Play Ground" />} />
        <Route path="logs" element={<ComingSoon label="Logs" />} />
        <Route path="settings" element={<ComingSoon label="Settings" />} />
        <Route path="eval" element={<div>Eval Page</div>} />
        <Route path="evals" element={<div>Evals Index Page</div>} />
        <Route path="setup" element={<div>Eval Creator Page</div>} />
        <Route path="prompts" element={<div>Prompts Page</div>} />
        <Route path="datasets" element={<div style={{ padding: 20 }}>Datasets Page</div>} />
        <Route path="history" element={<div style={{ padding: 20 }}>History Page</div>} />
      </Route>
    ),
    { basename }
  );

  return <RouterProvider router={router} />;
}

export default App;
