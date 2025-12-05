import { useState, useRef } from 'react';
import {
  FiSun,
  FiMoon,
  FiPlus,
  FiEdit3,
  FiCheck,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiCommand,
  FiGrid,
  FiMoreVertical,
} from 'react-icons/fi';
import { useDashboardStore } from '../store/dashboardStore';
import { useToast } from './Toast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import WidgetLibrary from './WidgetLibrary';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import DashboardTemplates from './DashboardTemplates';
import { exportDashboard, importDashboard } from '../utils/exportImport';
import type { DashboardTemplate } from '../utils/templates';

const DashboardHeader = () => {
  const { theme, toggleTheme, isEditing, setIsEditing, layout, widgets, addWidget, updateLayout } = useDashboardStore();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      metaKey: true,
      ctrlKey: true,
      action: () => setShowWidgetLibrary(true),
      description: 'Open widget library',
    },
    {
      key: 'e',
      metaKey: true,
      ctrlKey: true,
      action: () => setIsEditing(!isEditing),
      description: 'Toggle edit mode',
    },
    {
      key: 'd',
      metaKey: true,
      ctrlKey: true,
      action: () => toggleTheme(),
      description: 'Toggle dark mode',
    },
    {
      key: '/',
      metaKey: true,
      ctrlKey: true,
      action: () => setShowKeyboardHelp(true),
      description: 'Show keyboard shortcuts',
    },
    {
      key: 's',
      metaKey: true,
      ctrlKey: true,
      action: () => handleExport(),
      description: 'Export dashboard',
    },
    {
      key: 'o',
      metaKey: true,
      ctrlKey: true,
      action: () => fileInputRef.current?.click(),
      description: 'Import dashboard',
    },
    {
      key: 'r',
      metaKey: true,
      ctrlKey: true,
      action: () => handleRefreshAll(),
      description: 'Refresh all widgets',
    },
    {
      key: 't',
      metaKey: true,
      ctrlKey: true,
      action: () => setShowTemplates(true),
      description: 'Browse templates',
    },
  ]);

  const handleExport = () => {
    exportDashboard(layout, widgets, theme);
    toast.success('Dashboard exported successfully!');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importDashboard(file);

      // Apply imported config
      updateLayout(imported.layout);
      // Note: Widgets would need to be imported through the store as well
      // For now, this is a simplified version

      toast.success('Dashboard imported successfully!');
    } catch (error) {
      toast.error('Failed to import dashboard: ' + (error as Error).message);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRefreshAll = () => {
    // Trigger a refresh by dispatching a custom event
    window.dispatchEvent(new CustomEvent('refresh-all-widgets'));
    toast.info('Refreshing all widgets...');
  };

  const handleLoadTemplate = (template: DashboardTemplate) => {
    // Clear existing widgets
    // In a real implementation, we'd remove these from the store

    // Add each widget
    template.widgets.forEach((widgetTemplate) => {
      addWidget(widgetTemplate.type, widgetTemplate.config);
    });

    toast.success(`Loaded "${template.name}" template!`);
  };

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
                title="Add Widget (Cmd/Ctrl + K)"
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
                title={isEditing ? 'Exit edit mode (Cmd/Ctrl + E)' : 'Edit layout (Cmd/Ctrl + E)'}
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
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (Cmd/Ctrl + D)`}
              >
                {theme === 'light' ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </button>

              {/* Keyboard Shortcuts */}
              <button
                onClick={() => setShowKeyboardHelp(true)}
                className="btn-ghost p-2 hidden sm:block"
                title="Keyboard shortcuts (Cmd/Ctrl + /)"
              >
                <FiCommand className="w-5 h-5" />
              </button>

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="btn-ghost p-2"
                  title="More options"
                >
                  <FiMoreVertical className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <button
                      onClick={() => {
                        setShowTemplates(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <FiGrid className="w-4 h-4" />
                      <span>Templates</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRefreshAll();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Refresh All</span>
                    </button>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                    <button
                      onClick={() => {
                        handleExport();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Export Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <FiUpload className="w-4 h-4" />
                      <span>Import Dashboard</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImport}
        className="hidden"
      />

      {/* Modals */}
      {showWidgetLibrary && (
        <WidgetLibrary onClose={() => setShowWidgetLibrary(false)} />
      )}

      {showKeyboardHelp && (
        <KeyboardShortcutsHelp onClose={() => setShowKeyboardHelp(false)} />
      )}

      {showTemplates && (
        <DashboardTemplates
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={handleLoadTemplate}
        />
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default DashboardHeader;
