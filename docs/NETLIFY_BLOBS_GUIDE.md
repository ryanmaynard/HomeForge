# Netlify Blobs Integration Guide

This guide walks you through integrating Netlify Blobs for cloud-based data persistence, replacing the localStorage-based demo implementation.

## Why Netlify Blobs?

**Current (localStorage):**
- ✅ Fast and simple
- ✅ No configuration needed
- ❌ Data lost on browser clear
- ❌ No cross-device sync
- ❌ Limited to ~5-10MB

**With Netlify Blobs:**
- ✅ Cloud persistence
- ✅ Cross-device sync
- ✅ Unlimited storage
- ✅ Automatic backups
- ✅ Secure and fast

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Deployed Site**: Your HomeForge instance deployed to Netlify
3. **Netlify CLI** (optional): `npm install -g netlify-cli`

## Step 1: Install Dependencies

```bash
npm install @netlify/blobs
```

## Step 2: Create Blob Stores

Netlify Blobs organizes data into "stores". For HomeForge, we'll create:

- `homeforge-layouts` - Dashboard layouts
- `homeforge-widgets` - Widget instances
- `homeforge-tasks` - Task data

## Step 3: Update netlifyDB Service

Replace the localStorage implementation in `src/services/netlifyDB.ts`:

```typescript
import { getStore } from '@netlify/blobs';

// Get blob stores
const getLayoutStore = () => getStore('homeforge-layouts');
const getWidgetStore = () => getStore('homeforge-widgets');
const getTaskStore = () => getStore('homeforge-tasks');

export const netlifyDB: NetlifyDBClient = {
  // Layout Operations
  async getLayout(userId: string): Promise<DashboardLayout | null> {
    const store = getLayoutStore();
    const layout = await store.get(userId, { type: 'json' });
    return layout as DashboardLayout | null;
  },

  async saveLayout(
    userId: string,
    layouts: DashboardLayout['layouts']
  ): Promise<void> {
    const store = getLayoutStore();
    const layout: DashboardLayout = {
      id: `layout_${userId}`,
      userId,
      layouts,
      updatedAt: new Date().toISOString(),
    };
    await store.setJSON(userId, layout);
  },

  // Widget Operations
  async getWidget(widgetId: string): Promise<WidgetInstance | null> {
    const store = getWidgetStore();
    const widget = await store.get(widgetId, { type: 'json' });
    return widget as WidgetInstance | null;
  },

  async getWidgets(userId: string): Promise<WidgetInstance[]> {
    const store = getWidgetStore();
    const widgetsMap = await store.get(`user_${userId}`, { type: 'json' });
    return widgetsMap ? Object.values(widgetsMap) : [];
  },

  async saveWidget(widget: WidgetInstance): Promise<void> {
    const store = getWidgetStore();

    // Save individual widget
    await store.setJSON(widget.id, widget);

    // Update user's widgets collection
    const userKey = `user_${widget.userId}`;
    const widgets = await store.get(userKey, { type: 'json' }) || {};
    widgets[widget.id] = widget;
    await store.setJSON(userKey, widgets);
  },

  async deleteWidget(widgetId: string): Promise<void> {
    const store = getWidgetStore();

    // Get widget to find userId
    const widget = await this.getWidget(widgetId);
    if (!widget) return;

    // Delete individual widget
    await store.delete(widgetId);

    // Remove from user's widgets collection
    const userKey = `user_${widget.userId}`;
    const widgets = await store.get(userKey, { type: 'json' });
    if (widgets) {
      delete widgets[widgetId];
      await store.setJSON(userKey, widgets);
    }

    // Clean up associated tasks
    const taskStore = getTaskStore();
    await taskStore.delete(`widget_${widgetId}`);
  },

  // Task Operations
  async getTasks(widgetInstanceId: string): Promise<Task[]> {
    const store = getTaskStore();
    const tasks = await store.get(`widget_${widgetInstanceId}`, { type: 'json' });
    return tasks || [];
  },

  async saveTask(task: Task): Promise<void> {
    const store = getTaskStore();
    const tasksKey = `widget_${task.widgetInstanceId}`;
    const tasks = await this.getTasks(task.widgetInstanceId);

    // Find and update existing task, or add new one
    const existingIndex = tasks.findIndex((t) => t.id === task.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }

    // Sort by order
    tasks.sort((a, b) => a.order - b.order);

    await store.setJSON(tasksKey, tasks);
  },

  async deleteTask(taskId: string): Promise<void> {
    // This requires listing all widget keys, which is more complex
    // For now, we'll implement a simpler approach
    // In production, you'd want to maintain a task index
    console.warn('Task deletion requires widget context');
  },

  // User Operations (new)
  async getUser(userId: string): Promise<User | null> {
    const store = getStore('homeforge-users');
    const user = await store.get(userId, { type: 'json' });
    return user as User | null;
  },

  async saveUser(user: User): Promise<void> {
    const store = getStore('homeforge-users');
    await store.setJSON(user.id, user);
  },
};
```

## Step 4: Environment Configuration

### Local Development

Create a `.env.local` file:

```env
# Get these from Netlify dashboard
NETLIFY_AUTH_TOKEN=your_auth_token_here
NETLIFY_SITE_ID=your_site_id_here
```

### Production

Set environment variables in Netlify:

1. Go to your site's dashboard
2. Settings → Environment Variables
3. Add:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`

## Step 5: Test Locally

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Link your local project to Netlify
netlify link

# Start dev server with Netlify functions
netlify dev
```

## Step 6: Data Migration

Create a migration script to move existing localStorage data to Netlify Blobs:

```typescript
// scripts/migrate-to-blobs.ts
import { getStore } from '@netlify/blobs';
import { exportLocalData } from '../src/services/netlifyDB';

async function migrate() {
  const localData = exportLocalData();

  const layoutStore = getStore('homeforge-layouts');
  const widgetStore = getStore('homeforge-widgets');
  const taskStore = getStore('homeforge-tasks');

  // Migrate layouts
  for (const [key, value] of Object.entries(localData)) {
    if (key.startsWith('homeforge:layout:')) {
      const userId = key.replace('homeforge:layout:', '');
      await layoutStore.setJSON(userId, value);
      console.log(`Migrated layout for user: ${userId}`);
    }

    if (key.startsWith('homeforge:widgets:')) {
      const userId = key.replace('homeforge:widgets:', '');
      await widgetStore.setJSON(`user_${userId}`, value);
      console.log(`Migrated widgets for user: ${userId}`);
    }

    if (key.startsWith('homeforge:tasks:')) {
      const widgetId = key.replace('homeforge:tasks:', '');
      await taskStore.setJSON(`widget_${widgetId}`, value);
      console.log(`Migrated tasks for widget: ${widgetId}`);
    }
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
```

Run migration:

```bash
npx ts-node scripts/migrate-to-blobs.ts
```

## Step 7: Deploy

```bash
# Build and deploy
npm run build
netlify deploy --prod
```

## Advanced: Blob Store Management

### List All Stores

```typescript
import { listStores } from '@netlify/blobs';

const stores = await listStores();
console.log(stores);
```

### List Blob Keys in a Store

```typescript
import { getStore } from '@netlify/blobs';

const store = getStore('homeforge-layouts');
const { blobs } = await store.list();

blobs.forEach(blob => {
  console.log(`Key: ${blob.key}, Size: ${blob.size} bytes`);
});
```

### Set Metadata

```typescript
const store = getStore('homeforge-layouts');
await store.setJSON('user_123', layout, {
  metadata: {
    version: '1.0',
    lastModified: new Date().toISOString(),
  },
});
```

## Performance Optimization

### 1. Batch Operations

```typescript
// Instead of multiple individual calls
const promises = widgets.map(w => store.setJSON(w.id, w));
await Promise.all(promises);
```

### 2. Caching

Keep the existing cache layer (`src/services/cache.ts`) to minimize Blob reads:

```typescript
import { apiCache } from '../services/cache';

async function getLayoutCached(userId: string) {
  return await apiCache.fetchWithCache(
    `layout:${userId}`,
    () => netlifyDB.getLayout(userId),
    60 * 1000 // 1 minute cache
  );
}
```

### 3. Optimistic Updates

Update UI immediately, sync to Blobs in background:

```typescript
const saveWidget = async (widget: WidgetInstance) => {
  // Update local state immediately
  setWidgets(prev => ({ ...prev, [widget.id]: widget }));

  // Sync to Blobs in background
  netlifyDB.saveWidget(widget).catch(console.error);
};
```

## Monitoring & Debugging

### Check Blob Size

```bash
netlify blobs:list homeforge-layouts
netlify blobs:get homeforge-layouts user_123
```

### Monitor Usage

View blob storage usage in Netlify dashboard:
- Site Settings → Storage → Blobs

### Debugging

Enable debug logging:

```typescript
import { getStore } from '@netlify/blobs';

const store = getStore({
  name: 'homeforge-layouts',
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_AUTH_TOKEN,
  debug: true, // Enable debug logs
});
```

## Rollback Plan

If you need to rollback to localStorage:

1. Keep the old `netlifyDB.ts` as `netlifyDB.localStorage.ts`
2. Export data from Blobs:
   ```typescript
   const data = await store.list();
   // Download all data
   ```
3. Import back to localStorage using `importLocalData()`

## Pricing

Netlify Blobs pricing (as of 2024):

- **Free Tier**: 2GB storage, 1,000 requests/month
- **Pro Tier**: Included in Pro plan
- **Beyond**: $1/GB/month, $0.50/million requests

HomeForge typically uses:
- **Per user**: ~50-100KB
- **100 users**: ~5-10MB
- **1000 users**: ~50-100MB

Most users will stay within free tier!

## Troubleshooting

### Error: "Store not found"

```typescript
// Create store if it doesn't exist
const store = getStore('homeforge-layouts');
await store.setJSON('init', { created: true });
```

### Error: "Authentication failed"

Check your environment variables:
```bash
echo $NETLIFY_AUTH_TOKEN
echo $NETLIFY_SITE_ID
```

### Slow Reads

Implement caching:
```typescript
import { apiCache } from '../services/cache';
// See Performance Optimization section above
```

## Best Practices

1. **Use meaningful keys**: `user_${userId}` not just `${userId}`
2. **Set metadata**: Track versions, timestamps
3. **Implement caching**: Reduce Blob reads
4. **Batch operations**: Use Promise.all()
5. **Handle errors**: Graceful fallbacks
6. **Monitor usage**: Keep track of storage/requests
7. **Backup data**: Regular exports

## Resources

- [Netlify Blobs Docs](https://docs.netlify.com/blobs/overview/)
- [Netlify Blobs API Reference](https://sdk.netlify.com/blobs/)
- [HomeForge GitHub](https://github.com/ryanmaynard/HomeForge)

## Support

Questions? Open an issue on GitHub or check the discussions forum!

---

**Last Updated:** 2025-11-23
**Version:** 1.0.0
