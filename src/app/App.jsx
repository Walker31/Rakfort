import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/navbar.jsx';
import Sidebar from './components/sidebar.jsx'
import UsageDetails from './pages/redteam/usageDetails.jsx';
import { RedTeamConfigProvider } from './contexts/redteamconfigcontext.jsx';

const basename = import.meta.env.VITE_PUBLIC_BASENAME || '';

function Layout() {
  return (
    <>
    <RedTeamConfigProvider>
    <div className='dark:bg-[#22103B]'>
      <Navigation />
      <div className='flex'>
        <Sidebar/>
        <div className='flex-1'>
          <Outlet />
        </div>
      </div >
      </div>
      </RedTeamConfigProvider>
    </>
  );
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="eval" element={<div style={{ padding: 20 }}>Eval Page</div>} />
        <Route path="evals" element={<div style={{ padding: 20 }}>Evals Index Page</div>} />
        <Route path="setup" element={<div style={{ padding: 20 }}>Eval Creator Page</div>} />
        <Route path="redteam/setup" element={<div style={{ padding: 20 }}><UsageDetails/></div>} />
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
