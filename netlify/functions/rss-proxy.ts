/**
 * RSS Proxy Netlify Function
 *
 * This function fetches RSS feeds server-side to avoid CORS issues
 * and normalizes the XML to JSON format for the client.
 */

import type { Handler, HandlerEvent } from '@netlify/functions';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  feedTitle?: string;
  feedUrl?: string;
}

// Simple XML parser for RSS/Atom feeds
const parseRSS = (xmlText: string, feedUrl: string): RSSItem[] => {
  const items: RSSItem[] = [];

  try {
    // Extract feed title
    const feedTitleMatch = xmlText.match(/<title[^>]*>(.*?)<\/title>/i);
    const feedTitle = feedTitleMatch ? stripCDATA(feedTitleMatch[1]) : '';

    // Check if it's Atom or RSS
    const isAtom = xmlText.includes('<feed') && xmlText.includes('xmlns="http://www.w3.org/2005/Atom"');

    if (isAtom) {
      // Parse Atom feed
      const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
      const entries = xmlText.match(entryRegex) || [];

      for (const entry of entries.slice(0, 20)) {
        const titleMatch = entry.match(/<title[^>]*>(.*?)<\/title>/i);
        const linkMatch = entry.match(/<link[^>]*href=["'](.*?)["']/i) || entry.match(/<link[^>]*>(.*?)<\/link>/i);
        const dateMatch = entry.match(/<updated[^>]*>(.*?)<\/updated>/i) || entry.match(/<published[^>]*>(.*?)<\/published>/i);
        const summaryMatch = entry.match(/<summary[^>]*>(.*?)<\/summary>/i) || entry.match(/<content[^>]*>(.*?)<\/content>/i);

        if (titleMatch && linkMatch) {
          items.push({
            title: stripCDATA(stripTags(titleMatch[1])),
            link: stripCDATA(linkMatch[1]),
            pubDate: dateMatch ? stripCDATA(dateMatch[1]) : new Date().toISOString(),
            description: summaryMatch ? stripCDATA(stripTags(summaryMatch[1])).substring(0, 200) : undefined,
            feedTitle,
            feedUrl,
          });
        }
      }
    } else {
      // Parse RSS feed
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      const itemMatches = xmlText.match(itemRegex) || [];

      for (const item of itemMatches.slice(0, 20)) {
        const titleMatch = item.match(/<title[^>]*>(.*?)<\/title>/i);
        const linkMatch = item.match(/<link[^>]*>(.*?)<\/link>/i);
        const dateMatch = item.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i) || item.match(/<dc:date[^>]*>(.*?)<\/dc:date>/i);
        const descMatch = item.match(/<description[^>]*>(.*?)<\/description>/i);

        if (titleMatch && linkMatch) {
          items.push({
            title: stripCDATA(stripTags(titleMatch[1])),
            link: stripCDATA(linkMatch[1]),
            pubDate: dateMatch ? stripCDATA(dateMatch[1]) : new Date().toISOString(),
            description: descMatch ? stripCDATA(stripTags(descMatch[1])).substring(0, 200) : undefined,
            feedTitle,
            feedUrl,
          });
        }
      }
    }
  } catch (error) {
    console.error('RSS parsing error:', error);
  }

  return items;
};

// Strip CDATA wrapper
const stripCDATA = (text: string): string => {
  return text.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
};

// Strip HTML tags
const stripTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
};

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const feedUrl = event.queryStringParameters?.url;

  if (!feedUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing url parameter' }),
    };
  }

  try {
    // Fetch the RSS feed
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'HomeForge/1.0 RSS Reader',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const xmlText = await response.text();

    // Parse the RSS/Atom XML
    const items = parseRSS(xmlText, feedUrl);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify({ items }),
    };
  } catch (error) {
    console.error('RSS fetch error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch RSS feed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
