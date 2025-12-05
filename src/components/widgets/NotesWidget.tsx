import { useState, useEffect, useRef } from 'react';
import { FiFileText, FiEye, FiEdit } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { useDashboardStore } from '../../store/dashboardStore';
import type { NotesConfig } from '../../types';

interface NotesWidgetProps {
  widgetId: string;
  config: NotesConfig;
}

const NotesWidget = ({ widgetId, config }: NotesWidgetProps) => {
  const { updateWidgetConfig } = useDashboardStore();
  const [content, setContent] = useState(config.content || '');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(config.lastSaved || null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Autosave with debounce
  useEffect(() => {
    if (content === config.content) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for autosave (1 second debounce)
    saveTimeoutRef.current = setTimeout(() => {
      saveContent(content);
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const saveContent = async (newContent: string) => {
    setIsSaving(true);

    try {
      const now = new Date().toISOString();
      updateWidgetConfig(widgetId, {
        content: newContent,
        lastSaved: now,
      });
      setLastSaved(now);
    } catch (error) {
      console.error('Failed to save notes:', error);
    }

    setIsSaving(false);
  };

  const formatLastSaved = (): string => {
    if (!lastSaved) return 'Not saved';

    const date = new Date(lastSaved);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Saved just now';
    if (diff < 3600000) return `Saved ${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `Saved ${Math.floor(diff / 3600000)} hours ago`;

    return `Saved on ${date.toLocaleDateString()}`;
  };

  const isEmpty = !content.trim();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <FiFileText className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Notes
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          {/* Save Status */}
          <span className="text-xs text-slate-500">
            {isSaving ? 'Saving...' : formatLastSaved()}
          </span>

          {/* Mode Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setMode('edit')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                mode === 'edit'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FiEdit className="inline w-3 h-3 mr-1" />
              Edit
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                mode === 'preview'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FiEye className="inline w-3 h-3 mr-1" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {mode === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 bg-transparent resize-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 font-mono text-sm"
            placeholder="Start typing your notes here...

💡 Supports Markdown:
# Heading
**bold** *italic*
- List items
[Links](https://example.com)
`code`"
          />
        ) : (
          <div className="p-6">
            {isEmpty ? (
              <div className="text-center py-12 text-slate-500">
                <p className="mb-2">No content yet</p>
                <button
                  onClick={() => setMode('edit')}
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  Start writing
                </button>
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesWidget;
