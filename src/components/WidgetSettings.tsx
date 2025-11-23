import { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { useDashboardStore } from '../store/dashboardStore';
import { useToast } from './Toast';
import type { WidgetType, WidgetConfig, WeatherConfig, CryptoConfig, RSSConfig, TasksConfig, QuickLinksConfig, NotesConfig } from '../types';

interface WidgetSettingsProps {
  widgetId: string;
  type: WidgetType;
  config: WidgetConfig;
  onClose: () => void;
}

const WidgetSettings = ({ widgetId, type, config, onClose }: WidgetSettingsProps) => {
  const { updateWidgetConfig } = useDashboardStore();
  const toast = useToast();
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    updateWidgetConfig(widgetId, localConfig);
    toast.success('Widget settings saved!');
    onClose();
  };

  const renderSettings = () => {
    switch (type) {
      case 'weather':
        return <WeatherSettings config={localConfig as WeatherConfig} onChange={setLocalConfig} />;
      case 'crypto':
        return <CryptoSettings config={localConfig as CryptoConfig} onChange={setLocalConfig} />;
      case 'rss':
        return <RSSSettings config={localConfig as RSSConfig} onChange={setLocalConfig} />;
      case 'tasks':
        return <TasksSettings config={localConfig as TasksConfig} onChange={setLocalConfig} />;
      case 'quicklinks':
        return <QuickLinksSettings config={localConfig as QuickLinksConfig} onChange={setLocalConfig} />;
      case 'notes':
        return <NotesSettings config={localConfig as NotesConfig} onChange={setLocalConfig} />;
      default:
        return <div className="text-slate-500">No settings available for this widget.</div>;
    }
  };

  const getTitle = () => {
    const titles: Record<WidgetType, string> = {
      weather: 'Weather Settings',
      crypto: 'Crypto Settings',
      rss: 'RSS Settings',
      tasks: 'Tasks Settings',
      quicklinks: 'Quick Links Settings',
      notes: 'Notes Settings',
    };
    return titles[type] || 'Widget Settings';
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
        <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {getTitle()}
            </h2>
            <button
              onClick={onClose}
              className="btn-ghost p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Content */}
          <div className="mb-6">{renderSettings()}</div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
              <FiSave className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual widget settings components

const WeatherSettings = ({ config, onChange }: { config: WeatherConfig; onChange: (config: WeatherConfig) => void }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Default Location
      </label>
      <input
        type="text"
        value={config.location}
        onChange={(e) => onChange({ ...config, location: e.target.value })}
        className="input-field"
        placeholder="City name or ZIP code"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Temperature Units
      </label>
      <select
        value={config.units}
        onChange={(e) => onChange({ ...config, units: e.target.value as 'metric' | 'imperial' })}
        className="input-field"
      >
        <option value="metric">Celsius (°C)</option>
        <option value="imperial">Fahrenheit (°F)</option>
      </select>
    </div>
  </div>
);

const CryptoSettings = ({ config, onChange }: { config: CryptoConfig; onChange: (config: CryptoConfig) => void }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Currency
      </label>
      <select
        value={config.currency}
        onChange={(e) => onChange({ ...config, currency: e.target.value })}
        className="input-field"
      >
        <option value="USD">US Dollar (USD)</option>
        <option value="EUR">Euro (EUR)</option>
        <option value="GBP">British Pound (GBP)</option>
        <option value="JPY">Japanese Yen (JPY)</option>
        <option value="AUD">Australian Dollar (AUD)</option>
        <option value="CAD">Canadian Dollar (CAD)</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Tracked Symbols
      </label>
      <p className="text-xs text-slate-500 mb-2">
        Current: {config.symbols.join(', ')}
      </p>
      <p className="text-xs text-slate-500">
        Manage symbols by clicking the + button in the widget
      </p>
    </div>
  </div>
);

const RSSSettings = ({ config, onChange }: { config: RSSConfig; onChange: (config: RSSConfig) => void }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Maximum Items to Display
      </label>
      <input
        type="number"
        min="5"
        max="50"
        value={config.maxItems || 10}
        onChange={(e) => onChange({ ...config, maxItems: parseInt(e.target.value) })}
        className="input-field"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Feeds
      </label>
      <p className="text-xs text-slate-500">
        {config.feeds.length} feed{config.feeds.length !== 1 ? 's' : ''} configured
      </p>
    </div>
  </div>
);

const TasksSettings = ({ config, onChange }: { config: TasksConfig; onChange: (config: TasksConfig) => void }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Show Completed Tasks
      </label>
      <button
        onClick={() => onChange({ ...config, showCompleted: !config.showCompleted })}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          config.showCompleted ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            config.showCompleted ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  </div>
);

const QuickLinksSettings = ({ config }: { config: QuickLinksConfig; onChange: (config: QuickLinksConfig) => void }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Quick Links
      </label>
      <p className="text-xs text-slate-500">
        {config.links.length} link{config.links.length !== 1 ? 's' : ''} configured
      </p>
      <p className="text-xs text-slate-500 mt-2">
        Manage links directly in the widget
      </p>
    </div>
  </div>
);

const NotesSettings = ({ config }: { config: NotesConfig; onChange: (config: NotesConfig) => void }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Notes
      </label>
      <p className="text-xs text-slate-500">
        {config.content ? `${config.content.length} characters` : 'No content yet'}
      </p>
      {config.lastSaved && (
        <p className="text-xs text-slate-500 mt-1">
          Last saved: {new Date(config.lastSaved).toLocaleString()}
        </p>
      )}
    </div>
  </div>
);

export default WidgetSettings;
