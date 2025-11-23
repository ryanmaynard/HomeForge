/**
 * Netlify DB Access Layer
 *
 * This service provides a unified interface for all database operations.
 *
 * CURRENT IMPLEMENTATION: Uses localStorage for development/demo
 * PRODUCTION: Replace with Netlify Blobs API
 *
 * To switch to Netlify Blobs:
 * 1. Install: npm install @netlify/blobs
 * 2. Import: import { getStore } from '@netlify/blobs'
 * 3. Replace localStorage calls with blob store operations
 * 4. Add proper error handling and retry logic
 */

import type {
  User,
  DashboardLayout,
  WidgetInstance,
  Task,
  NetlifyDBClient,
} from '../types';

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  USER: (userId: string) => `homeforge:user:${userId}`,
  LAYOUT: (userId: string) => `homeforge:layout:${userId}`,
  WIDGETS: (userId: string) => `homeforge:widgets:${userId}`,
  WIDGET: (widgetId: string) => `homeforge:widget:${widgetId}`,
  TASKS: (widgetId: string) => `homeforge:tasks:${widgetId}`,
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

const getFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to get ${key} from storage:`, error);
    return null;
  }
};

const setInStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set ${key} in storage:`, error);
    throw new Error(`Storage operation failed: ${error}`);
  }
};

const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from storage:`, error);
  }
};

// ============================================================================
// Database Client Implementation
// ============================================================================

export const netlifyDB: NetlifyDBClient = {
  // --------------------------------------------------------------------------
  // User Operations
  // --------------------------------------------------------------------------

  async getUser(userId: string): Promise<User | null> {
    return getFromStorage<User>(STORAGE_KEYS.USER(userId));
  },

  async saveUser(user: User): Promise<void> {
    setInStorage(STORAGE_KEYS.USER(user.id), user);
  },

  // --------------------------------------------------------------------------
  // Layout Operations
  // --------------------------------------------------------------------------

  async getLayout(userId: string): Promise<DashboardLayout | null> {
    return getFromStorage<DashboardLayout>(STORAGE_KEYS.LAYOUT(userId));
  },

  async saveLayout(
    userId: string,
    layouts: DashboardLayout['layouts']
  ): Promise<void> {
    const layout: DashboardLayout = {
      id: `layout_${userId}`,
      userId,
      layouts,
      updatedAt: new Date().toISOString(),
    };
    setInStorage(STORAGE_KEYS.LAYOUT(userId), layout);
  },

  // --------------------------------------------------------------------------
  // Widget Operations
  // --------------------------------------------------------------------------

  async getWidget(widgetId: string): Promise<WidgetInstance | null> {
    return getFromStorage<WidgetInstance>(STORAGE_KEYS.WIDGET(widgetId));
  },

  async getWidgets(userId: string): Promise<WidgetInstance[]> {
    // Get all widgets for a user
    const widgetsMap = getFromStorage<Record<string, WidgetInstance>>(
      STORAGE_KEYS.WIDGETS(userId)
    );
    return widgetsMap ? Object.values(widgetsMap) : [];
  },

  async saveWidget(widget: WidgetInstance): Promise<void> {
    // Save individual widget
    setInStorage(STORAGE_KEYS.WIDGET(widget.id), widget);

    // Update user's widgets collection
    const widgetsKey = STORAGE_KEYS.WIDGETS(widget.userId);
    const widgets = getFromStorage<Record<string, WidgetInstance>>(widgetsKey) || {};
    widgets[widget.id] = widget;
    setInStorage(widgetsKey, widgets);
  },

  async deleteWidget(widgetId: string): Promise<void> {
    // Get widget to find userId
    const widget = await this.getWidget(widgetId);
    if (!widget) return;

    // Remove individual widget
    removeFromStorage(STORAGE_KEYS.WIDGET(widgetId));

    // Remove from user's widgets collection
    const widgetsKey = STORAGE_KEYS.WIDGETS(widget.userId);
    const widgets = getFromStorage<Record<string, WidgetInstance>>(widgetsKey);
    if (widgets) {
      delete widgets[widgetId];
      setInStorage(widgetsKey, widgets);
    }

    // Clean up associated tasks
    removeFromStorage(STORAGE_KEYS.TASKS(widgetId));
  },

  // --------------------------------------------------------------------------
  // Task Operations
  // --------------------------------------------------------------------------

  async getTasks(widgetInstanceId: string): Promise<Task[]> {
    const tasks = getFromStorage<Task[]>(STORAGE_KEYS.TASKS(widgetInstanceId));
    return tasks || [];
  },

  async saveTask(task: Task): Promise<void> {
    const tasksKey = STORAGE_KEYS.TASKS(task.widgetInstanceId);
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

    setInStorage(tasksKey, tasks);
  },

  async deleteTask(taskId: string): Promise<void> {
    // This is a bit inefficient with localStorage, but works for demo
    // In production with Netlify Blobs, we'd query by task ID directly

    // Find the task across all widget instances
    const allKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith('homeforge:tasks:')
    );

    for (const key of allKeys) {
      const tasks = getFromStorage<Task[]>(key);
      if (tasks) {
        const filtered = tasks.filter((t) => t.id !== taskId);
        if (filtered.length !== tasks.length) {
          setInStorage(key, filtered);
          return;
        }
      }
    }
  },
};

// ============================================================================
// Migration Utilities (for future Netlify Blobs integration)
// ============================================================================

/**
 * Export current localStorage data for migration to Netlify Blobs
 */
export const exportLocalData = (): Record<string, unknown> => {
  const data: Record<string, unknown> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('homeforge:')) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    }
  }

  return data;
};

/**
 * Import data into localStorage (for testing/development)
 */
export const importLocalData = (data: Record<string, unknown>): void => {
  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('homeforge:')) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
};

/**
 * Clear all HomeForge data from localStorage
 */
export const clearAllData = (): void => {
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith('homeforge:')
  );
  keys.forEach((key) => localStorage.removeItem(key));
};
