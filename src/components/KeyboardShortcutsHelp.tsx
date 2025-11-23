import { FiX, FiCommand } from 'react-icons/fi';
import { getModifierKeyName } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  onClose: () => void;
}

const KeyboardShortcutsHelp = ({ onClose }: KeyboardShortcutsHelpProps) => {
  const modKey = getModifierKeyName();

  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: `${modKey} + K`, description: 'Open widget library' },
        { keys: `${modKey} + E`, description: 'Toggle edit mode' },
        { keys: `${modKey} + D`, description: 'Toggle dark mode' },
        { keys: `${modKey} + /`, description: 'Show keyboard shortcuts' },
        { keys: 'Escape', description: 'Close modals' },
      ],
    },
    {
      category: 'Dashboard',
      items: [
        { keys: `${modKey} + S`, description: 'Export dashboard' },
        { keys: `${modKey} + O`, description: 'Import dashboard' },
        { keys: `${modKey} + R`, description: 'Refresh all widgets' },
        { keys: `${modKey} + T`, description: 'Browse templates' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FiCommand className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Shortcuts List */}
          <div className="space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {item.description}
                      </span>
                      <kbd className="px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm">
                        {item.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Press <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded">Escape</kbd> or click outside to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
