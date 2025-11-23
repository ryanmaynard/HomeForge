/**
 * Privacy-Preserving Global Stats Netlify Function
 *
 * This function returns aggregated, anonymous statistics about widget usage
 * across all HomeForge instances without exposing any user-identifying information.
 *
 * IMPORTANT: This is a demo implementation using localStorage aggregation.
 * In production, you would:
 * 1. Use Netlify Blobs to store aggregate counts
 * 2. Update counts when users save their dashboards
 * 3. Ensure no PII (Personally Identifiable Information) is stored or transmitted
 */

import type { Handler, HandlerEvent } from '@netlify/functions';
import type { GlobalStats, WidgetType } from '../../src/types';

// Simulated global stats (in production, this would be stored in Netlify Blobs)
const generateDemoStats = (): GlobalStats => {
  const widgetTypes: WidgetType[] = ['weather', 'crypto', 'rss', 'tasks', 'quicklinks', 'notes'];

  const widgetTypeCount: Record<WidgetType, number> = {
    weather: Math.floor(Math.random() * 1000) + 500,
    crypto: Math.floor(Math.random() * 800) + 400,
    rss: Math.floor(Math.random() * 600) + 300,
    tasks: Math.floor(Math.random() * 1200) + 600,
    quicklinks: Math.floor(Math.random() * 900) + 450,
    notes: Math.floor(Math.random() * 700) + 350,
  };

  const totalWidgets = Object.values(widgetTypeCount).reduce((sum, count) => sum + count, 0);

  return {
    totalWidgets,
    widgetTypeCount,
    totalUsers: Math.floor(Math.random() * 500) + 250, // Simulated user count
    lastUpdated: new Date().toISOString(),
  };
};

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // In production, you would fetch this from Netlify Blobs
    // Example:
    // const store = getStore('homeforge-stats');
    // const stats = await store.get('global-stats', { type: 'json' });

    const stats = generateDemoStats();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*', // Allow CORS
      },
      body: JSON.stringify(stats),
    };
  } catch (error) {
    console.error('Stats fetch error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

/**
 * Production Implementation Guide:
 *
 * 1. Set up Netlify Blobs store:
 *    ```typescript
 *    import { getStore } from '@netlify/blobs';
 *    const statsStore = getStore('homeforge-stats');
 *    ```
 *
 * 2. Increment widget counts when users save:
 *    - Create a separate function `update-stats` that:
 *      a. Accepts widget type and action (add/remove)
 *      b. Atomically increments/decrements counts
 *      c. Does NOT store user IDs or widget IDs
 *
 * 3. Store only aggregate data:
 *    ```typescript
 *    interface AggregateStats {
 *      widgetCounts: Record<WidgetType, number>;
 *      totalUsers: number; // Based on unique anonymous sessions
 *      lastUpdated: string;
 *    }
 *    ```
 *
 * 4. Privacy considerations:
 *    - Never store user IDs or session IDs in stats
 *    - Use anonymous counters only
 *    - Implement rate limiting to prevent abuse
 *    - Add data retention policies
 *    - Consider GDPR compliance if deploying in EU
 *
 * 5. Security:
 *    - Add authentication for write operations
 *    - Implement input validation
 *    - Use environment variables for sensitive config
 *    - Add logging for audit trails (without PII)
 */
