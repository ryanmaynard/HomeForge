import { useState } from 'react';
import { FiMove, FiX, FiSettings } from 'react-icons/fi';
import { useDashboardStore } from '../../store/dashboardStore';
import { useToast } from '../Toast';
import WidgetErrorBoundary from '../WidgetErrorBoundary';
import WidgetSettings from '../WidgetSettings';
import type { WidgetType, WidgetConfig } from '../../types';

// Import widget components
import WeatherWidget from './WeatherWidget';
import CryptoWidget from './CryptoWidget';
import RSSWidget from './RSSWidget';
import TasksWidget from './TasksWidget';
import QuickLinksWidget from './QuickLinksWidget';
import NotesWidget from './NotesWidget';

interface WidgetWrapperProps {
  widgetId: string;
  type: WidgetType;
  config: WidgetConfig;
  isEditing: boolean;
}

const WidgetWrapper = ({ widgetId, type, config, isEditing }: WidgetWrapperProps) => {
  const { removeWidget } = useDashboardStore();
  const toast = useToast();
  const [showSettings, setShowSettings] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this widget?')) {
      removeWidget(widgetId);
      toast.success('Widget removed');
    }
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  // Render the appropriate widget based on type
  const renderWidget = () => {
    switch (type) {
      case 'weather':
        return <WeatherWidget widgetId={widgetId} config={config} />;
      case 'crypto':
        return <CryptoWidget widgetId={widgetId} config={config} />;
      case 'rss':
        return <RSSWidget widgetId={widgetId} config={config} />;
      case 'tasks':
        return <TasksWidget widgetId={widgetId} config={config} />;
      case 'quicklinks':
        return <QuickLinksWidget widgetId={widgetId} config={config} />;
      case 'notes':
        return <NotesWidget widgetId={widgetId} config={config} />;
      default:
        return (
          <div className="p-4 text-center text-slate-500">
            Unknown widget type: {type}
          </div>
        );
    }
  };

  return (
    <>
      <div className="widget-card h-full flex flex-col relative">
        {/* Widget Controls (shown in edit mode) */}
        {isEditing && (
          <div className="absolute top-2 right-2 z-10 flex items-center space-x-1">
            {/* Drag Handle */}
            <div className="widget-drag-handle cursor-move p-2 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <FiMove className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>

            {/* Settings */}
            <button
              onClick={handleSettings}
              className="p-2 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              title="Widget settings"
            >
              <FiSettings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="p-2 bg-red-100 dark:bg-red-900/30 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              title="Remove widget"
            >
              <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        )}

        {/* Widget Content with Error Boundary */}
        <div className={`flex-1 overflow-auto ${isEditing ? 'pt-12' : ''}`}>
          <WidgetErrorBoundary widgetId={widgetId} widgetType={type}>
            {renderWidget()}
          </WidgetErrorBoundary>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <WidgetSettings
          widgetId={widgetId}
          type={type}
          config={config}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default WidgetWrapper;
