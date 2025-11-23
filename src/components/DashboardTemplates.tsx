import { FiX } from 'react-icons/fi';
import { DASHBOARD_TEMPLATES } from '../utils/templates';
import type { DashboardTemplate } from '../utils/templates';

interface DashboardTemplatesProps {
  onClose: () => void;
  onSelectTemplate: (template: DashboardTemplate) => void;
}

const DashboardTemplates = ({ onClose, onSelectTemplate }: DashboardTemplatesProps) => {
  const handleSelect = (template: DashboardTemplate) => {
    if (window.confirm(`Load the "${template.name}" template? This will replace your current dashboard.`)) {
      onSelectTemplate(template);
      onClose();
    }
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
                Dashboard Templates
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Choose a pre-configured layout to get started quickly
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
            {DASHBOARD_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className="group text-left p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-200 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="text-4xl mb-4">{template.icon}</div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {template.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {template.description}
                </p>

                {/* Widget Count */}
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded">
                    {template.widgets.length} widgets
                  </span>
                  {template.widgets.map((widget, i) => (
                    <span key={i} className="capitalize">
                      {i < 3 && widget.type}
                      {i === 3 && '...'}
                    </span>
                  )).filter(Boolean).slice(0, 4)}
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              💡 Tip: You can customize any template after loading it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplates;
