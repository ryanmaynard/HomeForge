import { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { useDashboardStore } from './store/dashboardStore';

function App() {
  const { initializeUser } = useDashboardStore();

  useEffect(() => {
    // Initialize user on app mount
    initializeUser();
  }, [initializeUser]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Dashboard />
    </div>
  );
}

export default App;
