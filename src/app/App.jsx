import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/navbar.jsx';
import Sidebar from './components/sidebar.jsx'
import UsageDetails from './pages/redteam/setup/usageDetails.jsx';
import { RedTeamConfigProvider } from './contexts/redteamconfigcontext.jsx';
import Home from './pages/Home/home.jsx';
import { useState } from 'react';
import Target from './pages/redteam/setup/Target/target.jsx';
import Plugins from './pages/redteam/setup/Plugins/Plugin.jsx';
import Strategies from './pages/redteam/setup/Strategies/Strategies.jsx';
import Review from './pages/redteam/setup/Review/Review.jsx';

const basename = import.meta.env.VITE_PUBLIC_BASENAME || '';

function Layout() {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <RedTeamConfigProvider>
      <div className="h-screen flex flex-col overflow-hidden dark:bg-[#22103B]">
        {/* Fixed Top Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation toggleSidebar={toggleSidebar}/>
        </div>

        {/* Body below navbar */}
        <div className="flex flex-1 pt-[64px] h-full overflow-hidden">
          {/* Sidebar (scrolls with content if too long) */}
          {!sidebarCollapsed && <Sidebar />}

          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
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
        <Route path="eval" element={<div style={{ padding: 20 }}>Eval Page</div>} />
        <Route path="evals" element={<div style={{ padding: 20 }}>Evals Index Page</div>} />
        <Route path="setup" element={<div style={{ padding: 20 }}>Eval Creator Page</div>} />
        <Route path="redteam/setup" element={<div style={{ padding: 20 }}><UsageDetails/></div>} />
        <Route path="redteam/setup/target" element={<div style={{ padding: 20 }}><Target/></div>} />
        <Route path="redteam/setup/plugin" element={<div style={{ padding: 20 }}><Plugins/></div>} />
        <Route path="redteam/setup/strategies" element={<div style={{ padding: 20 }}><Strategies/></div>} />
        <Route path="redteam/setup/review" element={<div style={{ padding: 20 }}><Review/></div>} />
        <Route path="prompts" element={<div style={{ padding: 20 }}>Prompts Page</div>} />
        <Route path="datasets" element={<div style={{ padding: 20 }}>Datasets Page</div>} />
        <Route path="history" element={<div style={{ padding: 20 }}>History Page</div>} />
      </Route>
    ),
    { basename }
  );

  return <RouterProvider router={router} />;
}

export default App;
