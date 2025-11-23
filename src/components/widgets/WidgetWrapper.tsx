import { FiMove, FiX, FiSettings } from 'react-icons/fi';
import { useDashboardStore } from '../../store/dashboardStore';
import type { WidgetType, WidgetConfig } from '../../types';

// Import widget components (we'll create these next)
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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this widget?')) {
      removeWidget(widgetId);
    }
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
    <div className="widget-card h-full flex flex-col relative">
      {/* Widget Controls (shown in edit mode) */}
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex items-center space-x-1">
          {/* Drag Handle */}
          <div className="widget-drag-handle cursor-move p-2 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
            <FiMove className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>

          {/* Settings (placeholder for future config) */}
          <button
            className="p-2 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
            title="Widget settings"
          >
            <FiSettings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-2 bg-red-100 dark:bg-red-900/30 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
            title="Remove widget"
          >
            <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      )}

      {/* Widget Content */}
      <div className={`flex-1 overflow-auto ${isEditing ? 'pt-12' : ''}`}>
        {renderWidget()}
      </div>
    </div>
  );
};

export default WidgetWrapper;
