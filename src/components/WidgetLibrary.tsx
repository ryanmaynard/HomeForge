import { FiX, FiCloud, FiDollarSign, FiRss, FiCheckSquare, FiLink, FiFileText } from 'react-icons/fi';
import { useDashboardStore } from '../store/dashboardStore';
import type { WidgetType, WidgetLibraryItem } from '../types';

interface WidgetLibraryProps {
  onClose: () => void;
}

const WIDGET_CATALOG: WidgetLibraryItem[] = [
  {
    type: 'weather',
    title: 'Weather',
    description: 'Current conditions and forecast for your location',
    icon: 'FiCloud',
    defaultSize: { w: 4, h: 2 },
    minSize: { w: 3, h: 2 },
  },
  {
    type: 'crypto',
    title: 'Crypto Prices',
    description: 'Track cryptocurrency prices and 24h changes',
    icon: 'FiDollarSign',
    defaultSize: { w: 4, h: 2 },
    minSize: { w: 3, h: 2 },
  },
  {
    type: 'rss',
    title: 'RSS Reader',
    description: 'Aggregate and read your favorite RSS feeds',
    icon: 'FiRss',
    defaultSize: { w: 6, h: 3 },
    minSize: { w: 4, h: 2 },
  },
  {
    type: 'tasks',
    title: 'Task List',
    description: 'Simple to-do list to track your tasks',
    icon: 'FiCheckSquare',
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
  },
  {
    type: 'quicklinks',
    title: 'Quick Links',
    description: 'Your most-visited links in one place',
    icon: 'FiLink',
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
  },
  {
    type: 'notes',
    title: 'Notes',
    description: 'Quick notes and markdown editor',
    icon: 'FiFileText',
    defaultSize: { w: 6, h: 3 },
    minSize: { w: 4, h: 2 },
  },
];

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    FiCloud,
    FiDollarSign,
    FiRss,
    FiCheckSquare,
    FiLink,
    FiFileText,
  };
  return icons[iconName] || FiFileText;
};

const WidgetLibrary = ({ onClose }: WidgetLibraryProps) => {
  const { addWidget } = useDashboardStore();

  const handleAddWidget = (type: WidgetType) => {
    addWidget(type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full p-6 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Widget Library
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Choose a widget to add to your dashboard
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Widget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WIDGET_CATALOG.map((widget) => {
              const IconComponent = getIconComponent(widget.icon);

              return (
                <button
                  key={widget.type}
                  onClick={() => handleAddWidget(widget.type)}
                  className="group relative p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-200 text-left hover:shadow-lg"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {widget.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {widget.description}
                  </p>

                  {/* Size info */}
                  <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                    Default size: {widget.defaultSize.w} × {widget.defaultSize.h}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              💡 Tip: You can drag widgets to reorder them and resize them to fit your needs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetLibrary;
