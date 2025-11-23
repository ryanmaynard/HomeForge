import { useState } from 'react';
import { FiSun, FiMoon, FiPlus, FiEdit3, FiCheck, FiSettings } from 'react-icons/fi';
import { useDashboardStore } from '../store/dashboardStore';
import WidgetLibrary from './WidgetLibrary';

const DashboardHeader = () => {
  const { theme, toggleTheme, isEditing, setIsEditing } = useDashboardStore();
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  HomeForge
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your Personal Dashboard
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Add Widget Button */}
              <button
                onClick={() => setShowWidgetLibrary(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Widget</span>
              </button>

              {/* Edit Mode Toggle */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`btn-secondary flex items-center space-x-2 ${
                  isEditing ? 'ring-2 ring-primary-500' : ''
                }`}
                title={isEditing ? 'Exit edit mode' : 'Edit layout'}
              >
                {isEditing ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Done</span>
                  </>
                ) : (
                  <>
                    <FiEdit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="btn-ghost p-2"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </button>

              {/* Settings (placeholder for future) */}
              <button
                className="btn-ghost p-2 hidden sm:block"
                title="Settings"
              >
                <FiSettings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <WidgetLibrary onClose={() => setShowWidgetLibrary(false)} />
      )}
    </>
  );
};

export default DashboardHeader;
