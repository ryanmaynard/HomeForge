import { useState, useEffect } from 'react';
import { FiRefreshCw, FiPlus, FiX, FiExternalLink, FiRss } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useDashboardStore } from '../../store/dashboardStore';
import { fetchMultipleRSSFeeds, POPULAR_FEEDS } from '../../services/rssAPI';
import type { RSSConfig, RSSItem, RSSFeed } from '../../types';

interface RSSWidgetProps {
  widgetId: string;
  config: RSSConfig;
}

const RSSWidget = ({ widgetId, config }: RSSWidgetProps) => {
  const { updateWidgetConfig } = useDashboardStore();
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const maxItems = config.maxItems || 10;

  const loadFeeds = async () => {
    if (config.feeds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const feedUrls = config.feeds.map((f) => f.url);
      const fetchedItems = await fetchMultipleRSSFeeds(feedUrls);
      setItems(fetchedItems.slice(0, maxItems));
    } catch (err) {
      setError('Failed to load RSS feeds');
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadFeeds();
    // Refresh every 10 minutes
    const interval = setInterval(loadFeeds, 10 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.feeds, maxItems]);

  const handleAddFeed = (url: string, title?: string) => {
    const trimmedUrl = url.trim();
    if (trimmedUrl && !config.feeds.find((f) => f.url === trimmedUrl)) {
      const newFeed: RSSFeed = {
        url: trimmedUrl,
        title: title || new URL(trimmedUrl).hostname,
      };
      updateWidgetConfig(widgetId, {
        feeds: [...config.feeds, newFeed],
      });
      setNewFeedUrl('');
      setIsAdding(false);
      setShowSuggestions(false);
    }
  };

  const handleRemoveFeed = (url: string) => {
    updateWidgetConfig(widgetId, {
      feeds: config.feeds.filter((f) => f.url !== url),
    });
  };

  const formatDate = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  if (config.feeds.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <div className="text-center max-w-sm">
          <FiRss className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
            No RSS feeds added
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Add your favorite RSS feeds to stay updated
          </p>

          {!isAdding && (
            <div className="space-y-2">
              <button onClick={() => setIsAdding(true)} className="btn-primary text-sm">
                <FiPlus className="inline mr-2" />
                Add Feed
              </button>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="btn-secondary text-sm ml-2"
              >
                Browse Popular
              </button>
            </div>
          )}

          {isAdding && (
            <div className="mt-4">
              <input
                type="url"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFeed(newFeedUrl)}
                className="input-field text-sm w-full mb-2"
                placeholder="Enter RSS feed URL"
                autoFocus
              />
              <div className="flex space-x-2">
                <button onClick={() => handleAddFeed(newFeedUrl)} className="btn-primary text-sm flex-1">
                  Add
                </button>
                <button onClick={() => setIsAdding(false)} className="btn-ghost text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="mt-4 text-left max-h-60 overflow-auto scrollbar-thin">
              <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Popular Feeds:
              </h4>
              {POPULAR_FEEDS.map((feed) => (
                <button
                  key={feed.url}
                  onClick={() => handleAddFeed(feed.url, feed.title)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  {feed.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading feeds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={loadFeeds} className="btn-primary text-sm">
          <FiRefreshCw className="inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">
          RSS Feeds ({config.feeds.length})
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-slate-400 hover:text-primary-500"
            title="Add feed"
          >
            <FiPlus className="w-4 h-4" />
          </button>
          <button
            onClick={loadFeeds}
            className="text-slate-400 hover:text-primary-500"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Add Feed Input */}
      {isAdding && (
        <div className="mb-4">
          <input
            type="url"
            value={newFeedUrl}
            onChange={(e) => setNewFeedUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFeed(newFeedUrl)}
            className="input-field text-sm w-full mb-2"
            placeholder="Enter RSS feed URL"
            autoFocus
          />
          <div className="flex space-x-2">
            <button onClick={() => handleAddFeed(newFeedUrl)} className="btn-primary text-sm flex-1">
              Add
            </button>
            <button onClick={() => setIsAdding(false)} className="btn-ghost text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Feed Management */}
      {config.feeds.length > 0 && (
        <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <details className="text-xs">
            <summary className="cursor-pointer text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Manage feeds ({config.feeds.length})
            </summary>
            <div className="mt-2 space-y-1">
              {config.feeds.map((feed) => (
                <div
                  key={feed.url}
                  className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded group"
                >
                  <span className="text-xs truncate flex-1">{feed.title}</span>
                  <button
                    onClick={() => handleRemoveFeed(feed.url)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* RSS Items */}
      <div className="flex-1 overflow-auto scrollbar-thin space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No items found in feeds
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item.link}-${index}`}
              className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 p-3 rounded-lg transition-colors"
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h4 className="font-medium text-slate-900 dark:text-white mb-1 flex items-start group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  <span className="flex-1">{item.title}</span>
                  <FiExternalLink className="w-3 h-3 ml-2 mt-1 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                </h4>

                {item.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center text-xs text-slate-500 space-x-2">
                  {item.feedTitle && <span>{item.feedTitle}</span>}
                  <span>•</span>
                  <span>{formatDate(item.pubDate)}</span>
                </div>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RSSWidget;
