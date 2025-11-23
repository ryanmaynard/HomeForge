/**
 * RSS API Service
 *
 * Fetches RSS feeds via Netlify Function proxy to avoid CORS issues
 */

import type { RSSItem } from '../types';

export const fetchRSSFeed = async (feedUrl: string): Promise<RSSItem[]> => {
  try {
    const response = await fetch(
      `/.netlify/functions/rss-proxy?url=${encodeURIComponent(feedUrl)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch RSS feed');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('RSS API error:', error);
    throw error;
  }
};

export const fetchMultipleRSSFeeds = async (feedUrls: string[]): Promise<RSSItem[]> => {
  try {
    const results = await Promise.allSettled(
      feedUrls.map((url) => fetchRSSFeed(url))
    );

    const allItems: RSSItem[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    });

    // Sort by date, newest first
    allItems.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });

    return allItems;
  } catch (error) {
    console.error('RSS multi-fetch error:', error);
    throw error;
  }
};

// Popular RSS feed suggestions
export const POPULAR_FEEDS = [
  {
    title: 'Hacker News',
    url: 'https://news.ycombinator.com/rss',
  },
  {
    title: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
  },
  {
    title: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
  },
  {
    title: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
  },
  {
    title: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
  },
  {
    title: 'Smashing Magazine',
    url: 'https://www.smashingmagazine.com/feed/',
  },
  {
    title: 'CSS-Tricks',
    url: 'https://css-tricks.com/feed/',
  },
  {
    title: 'Dev.to',
    url: 'https://dev.to/feed',
  },
];
