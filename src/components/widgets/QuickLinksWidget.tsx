import { useState } from 'react';
import { FiPlus, FiX, FiExternalLink, FiLink as FiLinkIcon, FiEdit2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { useDashboardStore } from '../../store/dashboardStore';
import type { QuickLinksConfig, QuickLink } from '../../types';

interface QuickLinksWidgetProps {
  widgetId: string;
  config: QuickLinksConfig;
}

const QuickLinksWidget = ({ widgetId, config }: QuickLinksWidgetProps) => {
  const { updateWidgetConfig } = useDashboardStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ label: '', url: '', icon: '' });

  const handleAddLink = () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;

    const link: QuickLink = {
      id: `link_${uuidv4()}`,
      label: newLink.label.trim(),
      url: newLink.url.trim(),
      icon: newLink.icon.trim() || '🔗',
    };

    updateWidgetConfig(widgetId, {
      links: [...config.links, link],
    });

    setNewLink({ label: '', url: '', icon: '' });
    setIsAdding(false);
  };

  const handleUpdateLink = (linkId: string, updates: Partial<QuickLink>) => {
    updateWidgetConfig(widgetId, {
      links: config.links.map((link) =>
        link.id === linkId ? { ...link, ...updates } : link
      ),
    });
    setEditingId(null);
  };

  const handleDeleteLink = (linkId: string) => {
    updateWidgetConfig(widgetId, {
      links: config.links.filter((link) => link.id !== linkId),
    });
  };

  const getFaviconUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  if (config.links.length === 0 && !isAdding) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <FiLinkIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
            No quick links
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Add your favorite websites for quick access
          </p>
          <button onClick={() => setIsAdding(true)} className="btn-primary text-sm">
            <FiPlus className="inline mr-2" />
            Add Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Quick Links
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-slate-400 hover:text-primary-500"
          title="Add link"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Link Form */}
      {isAdding && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="space-y-2">
            <input
              type="text"
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
              className="input-field text-sm w-full"
              placeholder="Label (e.g., GitHub)"
              autoFocus
            />
            <input
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="input-field text-sm w-full"
              placeholder="URL (e.g., https://github.com)"
            />
            <input
              type="text"
              value={newLink.icon}
              onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
              className="input-field text-sm w-full"
              placeholder="Icon (emoji, optional)"
              maxLength={2}
            />
            <div className="flex space-x-2">
              <button onClick={handleAddLink} className="btn-primary text-sm flex-1">
                Add Link
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewLink({ label: '', url: '', icon: '' });
                }}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links Grid */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="grid grid-cols-1 gap-2">
          {config.links.map((link) => (
            <div
              key={link.id}
              className="group relative p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {editingId === link.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    defaultValue={link.label}
                    onBlur={(e) => handleUpdateLink(link.id, { label: e.target.value })}
                    className="input-field text-sm w-full"
                  />
                  <input
                    type="url"
                    defaultValue={link.url}
                    onBlur={(e) => handleUpdateLink(link.id, { url: e.target.value })}
                    className="input-field text-sm w-full"
                  />
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-primary text-xs"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3"
                >
                  {/* Icon/Favicon */}
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {link.icon ? (
                      <span className="text-2xl">{link.icon}</span>
                    ) : (
                      <img
                        src={getFaviconUrl(link.url)}
                        alt=""
                        className="w-6 h-6"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  {/* Label & URL */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      {link.label}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {new URL(link.url).hostname}
                    </div>
                  </div>

                  <FiExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                </a>
              )}

              {/* Edit/Delete Buttons */}
              {editingId !== link.id && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingId(link.id);
                    }}
                    className="p-1 bg-white dark:bg-slate-800 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <FiEdit2 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteLink(link.id);
                    }}
                    className="p-1 bg-white dark:bg-slate-800 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <FiX className="w-3 h-3 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinksWidget;
