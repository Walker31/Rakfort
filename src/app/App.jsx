import {
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
  Route,
  RouterProvider,
  Outlet,
} from 'react-router-dom';

import Navigation from './components/navbar.jsx';
import Sidebar from './components/sidebar.jsx';

import { RedTeamConfigProvider } from './contexts/redteamconfigcontext.jsx';

import Home from './pages/Home/home.jsx';

import UsageDetails from './pages/redteam/setup/usageDetails.jsx';
import Target from './pages/redteam/setup/Target/target.jsx';
import Plugins from './pages/redteam/setup/Plugins/Plugin.jsx';
import Strategies from './pages/redteam/setup/Strategies/Strategies.jsx';
import Review from './pages/redteam/setup/Review/Review.jsx';

import {
  EvalPrompts,
  EvalHistory,
  EvalAll,
  EvalDataset,
  LatestEvals,
} from './pages/evals';
import { useUIStore } from './store/uiStore.jsx';

const basename = import.meta.env.VITE_PUBLIC_BASENAME || '';

function Layout() {
  const location = useLocation();

  const sidebarOpen = useUIStore(state => state.sidebarOpen);
  const toggleSidebar = useUIStore(state => state.toggleSidebar);


  // Show Sidebar on /redteam/* or /evals/* routes
  const showSidebar =
    location.pathname.startsWith('/redteam') ||
    location.pathname.startsWith('/evals');

  return (
    <RedTeamConfigProvider>
      <div className="h-screen flex flex-col overflow-hidden dark:bg-[#22103B]">
        {/* Fixed Top Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation toggleSidebar={toggleSidebar} />
        </div>

        {/* Body below navbar */}
        <div className="flex flex-1 pt-[64px] h-full overflow-hidden">
          {/* Sidebar */}
          {showSidebar && sidebarOpen && <Sidebar />}

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto ">
            <Outlet />
          </main>
        </div>
      </div>
    </RedTeamConfigProvider>
  );
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Evals Routes */}
        <Route path="evals">
          <Route index element={<LatestEvals />} />
          <Route path="prompts" element={<EvalPrompts />} />
          <Route path="datasets" element={<EvalDataset />} />
          <Route path="history" element={<EvalHistory />} />
          <Route path="all" element={<EvalAll />} />
        </Route>

        {/* Redteam Setup Routes */}
        <Route path="redteam/setup">
          <Route index element={<UsageDetails />} />
          <Route path="target" element={<Target />} />
          <Route path="plugin" element={<Plugins />} />
          <Route path="strategies" element={<Strategies />} />
          <Route path="review" element={<Review />} />
        </Route>

        {/* If you have a "setup" route outside of redteam, define it here */}
        <Route path="setup" element={<div>Eval Creator Page</div>} />
      </Route>
    ),
    { basename }
  );

  return <RouterProvider router={router} />;
}

export default App;
