/**
 * Dashboard Templates & Presets
 *
 * Pre-configured dashboard layouts for different use cases
 */

import type { WidgetType, WidgetConfig } from '../types';

export interface WidgetTemplate {
  type: WidgetType;
  config: Partial<WidgetConfig>;
  position: { x: number; y: number; w: number; h: number };
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  widgets: WidgetTemplate[];
}

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'developer',
    name: 'Developer',
    description: 'Perfect for developers - tech news, crypto, and tasks',
    icon: '👨‍💻',
    widgets: [
      {
        type: 'rss',
        config: {
          feeds: [
            { url: 'https://news.ycombinator.com/rss', title: 'Hacker News' },
            { url: 'https://techcrunch.com/feed/', title: 'TechCrunch' },
            { url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge' },
          ],
          maxItems: 15,
        },
        position: { x: 0, y: 0, w: 6, h: 4 },
      },
      {
        type: 'crypto',
        config: {
          symbols: ['BTC', 'ETH', 'SOL'],
          currency: 'USD',
        },
        position: { x: 6, y: 0, w: 3, h: 2 },
      },
      {
        type: 'tasks',
        config: {
          showCompleted: true,
        },
        position: { x: 9, y: 0, w: 3, h: 4 },
      },
      {
        type: 'weather',
        config: {
          location: 'San Francisco',
          units: 'imperial',
        },
        position: { x: 6, y: 2, w: 3, h: 2 },
      },
      {
        type: 'notes',
        config: {
          content: '# Developer Notes\n\n- [ ] Review PRs\n- [ ] Update documentation\n- [ ] Refactor auth module',
        },
        position: { x: 0, y: 4, w: 6, h: 3 },
      },
      {
        type: 'quicklinks',
        config: {
          links: [
            { id: '1', label: 'GitHub', url: 'https://github.com', icon: '💻' },
            { id: '2', label: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚' },
            { id: '3', label: 'MDN', url: 'https://developer.mozilla.org', icon: '📖' },
          ],
        },
        position: { x: 6, y: 4, w: 6, h: 3 },
      },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Focus on getting things done - tasks, notes, and links',
    icon: '✅',
    widgets: [
      {
        type: 'tasks',
        config: {
          showCompleted: false,
        },
        position: { x: 0, y: 0, w: 4, h: 4 },
      },
      {
        type: 'notes',
        config: {
          content: '# Daily Focus\n\n## Today\'s Priorities\n1. \n2. \n3. \n\n## Notes\n',
        },
        position: { x: 4, y: 0, w: 8, h: 4 },
      },
      {
        type: 'quicklinks',
        config: {
          links: [
            { id: '1', label: 'Gmail', url: 'https://gmail.com', icon: '📧' },
            { id: '2', label: 'Calendar', url: 'https://calendar.google.com', icon: '📅' },
            { id: '3', label: 'Drive', url: 'https://drive.google.com', icon: '📁' },
            { id: '4', label: 'Slack', url: 'https://slack.com', icon: '💬' },
          ],
        },
        position: { x: 0, y: 4, w: 4, h: 2 },
      },
      {
        type: 'weather',
        config: {
          location: 'New York',
          units: 'imperial',
        },
        position: { x: 4, y: 4, w: 4, h: 2 },
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Track markets, crypto, and financial news',
    icon: '💰',
    widgets: [
      {
        type: 'crypto',
        config: {
          symbols: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'DOT'],
          currency: 'USD',
        },
        position: { x: 0, y: 0, w: 6, h: 3 },
      },
      {
        type: 'rss',
        config: {
          feeds: [
            { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', title: 'CoinDesk' },
            { url: 'https://cointelegraph.com/rss', title: 'Cointelegraph' },
          ],
          maxItems: 10,
        },
        position: { x: 6, y: 0, w: 6, h: 4 },
      },
      {
        type: 'notes',
        config: {
          content: '# Investment Notes\n\n## Portfolio\n\n## Watchlist\n',
        },
        position: { x: 0, y: 3, w: 6, h: 3 },
      },
    ],
  },
  {
    id: 'news',
    name: 'News Hub',
    description: 'Stay informed with multiple news sources',
    icon: '📰',
    widgets: [
      {
        type: 'rss',
        config: {
          feeds: [
            { url: 'https://news.ycombinator.com/rss', title: 'Hacker News' },
            { url: 'https://techcrunch.com/feed/', title: 'TechCrunch' },
            { url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge' },
            { url: 'https://feeds.arstechnica.com/arstechnica/index', title: 'Ars Technica' },
          ],
          maxItems: 20,
        },
        position: { x: 0, y: 0, w: 12, h: 5 },
      },
      {
        type: 'weather',
        config: {
          location: 'London',
          units: 'metric',
        },
        position: { x: 0, y: 5, w: 4, h: 2 },
      },
      {
        type: 'quicklinks',
        config: {
          links: [
            { id: '1', label: 'BBC News', url: 'https://bbc.com/news', icon: '📺' },
            { id: '2', label: 'Reuters', url: 'https://reuters.com', icon: '📡' },
            { id: '3', label: 'The Guardian', url: 'https://theguardian.com', icon: '📰' },
          ],
        },
        position: { x: 4, y: 5, w: 4, h: 2 },
      },
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple - just the essentials',
    icon: '✨',
    widgets: [
      {
        type: 'weather',
        config: {
          location: 'Tokyo',
          units: 'metric',
        },
        position: { x: 0, y: 0, w: 4, h: 2 },
      },
      {
        type: 'tasks',
        config: {
          showCompleted: false,
        },
        position: { x: 4, y: 0, w: 4, h: 3 },
      },
      {
        type: 'quicklinks',
        config: {
          links: [
            { id: '1', label: 'Gmail', url: 'https://gmail.com', icon: '📧' },
            { id: '2', label: 'Calendar', url: 'https://calendar.google.com', icon: '📅' },
          ],
        },
        position: { x: 8, y: 0, w: 4, h: 2 },
      },
      {
        type: 'notes',
        config: {
          content: '# Quick Notes\n\n',
        },
        position: { x: 0, y: 2, w: 8, h: 2 },
      },
    ],
  },
];

/**
 * Get template by ID
 */
export const getTemplate = (id: string): DashboardTemplate | undefined => {
  return DASHBOARD_TEMPLATES.find((template) => template.id === id);
};

/**
 * Get all template IDs and names
 */
export const getTemplateList = (): Array<{ id: string; name: string; description: string; icon: string }> => {
  return DASHBOARD_TEMPLATES.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    icon: template.icon,
  }));
};
