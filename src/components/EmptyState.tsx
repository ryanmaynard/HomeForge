import { useState } from 'react';
import { FiPlus, FiGrid } from 'react-icons/fi';
import WidgetLibrary from './WidgetLibrary';

const EmptyState = () => {
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md px-4">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
            <FiGrid className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Welcome to HomeForge!
          </h2>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your dashboard is empty. Get started by adding your first widget. Choose from weather,
            crypto prices, RSS feeds, tasks, quick links, and more!
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowWidgetLibrary(true)}
            className="btn-primary inline-flex items-center space-x-2 text-lg px-6 py-3"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Your First Widget</span>
          </button>

          {/* Tips */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Quick Tips:
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 text-left">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Click "Add Widget" to choose from available widgets</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use "Edit" mode to drag and resize widgets</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your layout is automatically saved</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Toggle dark mode with the moon/sun icon</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showWidgetLibrary && (
        <WidgetLibrary onClose={() => setShowWidgetLibrary(false)} />
      )}
    </>
  );
};

export default EmptyState;
