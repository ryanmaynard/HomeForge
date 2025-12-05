import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  DashboardState,
  GridLayout,
  WidgetInstance,
  WidgetType,
  WidgetConfig,
} from '../types';

interface DashboardStore extends DashboardState {
  // User management
  initializeUser: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Widget management
  addWidget: (type: WidgetType, config?: Partial<WidgetConfig>) => string;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<WidgetInstance>) => void;
  updateWidgetConfig: (widgetId: string, config: Partial<WidgetConfig>) => void;

  // Layout management
  updateLayout: (newLayout: GridLayout[]) => void;
  setIsEditing: (isEditing: boolean) => void;

  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

// Default widget configurations by type
const getDefaultConfig = (type: WidgetType): WidgetConfig => {
  switch (type) {
    case 'weather':
      return { location: 'New York', units: 'imperial' };
    case 'crypto':
      return { symbols: ['BTC', 'ETH'], currency: 'USD' };
    case 'rss':
      return { feeds: [], maxItems: 10 };
    case 'tasks':
      return { showCompleted: true };
    case 'quicklinks':
      return { links: [] };
    case 'notes':
      return { content: '' };
    default:
      return { showCompleted: true };
  }
};

// Default widget sizes by type (in grid units, where 12 = full width)
const getDefaultSize = (type: WidgetType): { w: number; h: number } => {
  switch (type) {
    case 'weather':
      return { w: 4, h: 2 };
    case 'crypto':
      return { w: 4, h: 2 };
    case 'rss':
      return { w: 6, h: 3 };
    case 'tasks':
      return { w: 4, h: 3 };
    case 'quicklinks':
      return { w: 3, h: 2 };
    case 'notes':
      return { w: 6, h: 3 };
    default:
      return { w: 4, h: 2 };
  }
};

// Generate a unique user ID or retrieve from localStorage
const getUserId = (): string => {
  const stored = localStorage.getItem('homeforge_user_id');
  if (stored) return stored;

  const newId = `user_${uuidv4()}`;
  localStorage.setItem('homeforge_user_id', newId);
  return newId;
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial state
  userId: '',
  layout: [],
  widgets: {},
  isEditing: false,
  theme: 'light',

  // Initialize user
  initializeUser: () => {
    const userId = getUserId();
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';

    set({ userId, theme: savedTheme });

    // Load saved dashboard from localStorage (will be replaced with Netlify DB)
    get().loadFromStorage();
  },

  // Theme management
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  // Add a new widget
  addWidget: (type, configOverrides = {}) => {
    const widgetId = `widget_${uuidv4()}`;
    const now = new Date().toISOString();
    const { userId, layout } = get();

    // Create widget instance
    const widget: WidgetInstance = {
      id: widgetId,
      type,
      userId,
      config: { ...getDefaultConfig(type), ...configOverrides },
      createdAt: now,
      updatedAt: now,
    };

    // Calculate position for new widget
    const size = getDefaultSize(type);
    const maxY = layout.length > 0 ? Math.max(...layout.map((l) => l.y + l.h)) : 0;

    const newLayoutItem: GridLayout = {
      i: widgetId,
      x: 0,
      y: maxY,
      w: size.w,
      h: size.h,
      minW: 2,
      minH: 2,
    };

    set((state) => ({
      widgets: { ...state.widgets, [widgetId]: widget },
      layout: [...state.layout, newLayoutItem],
    }));

    get().saveToStorage();
    return widgetId;
  },

  // Remove widget
  removeWidget: (widgetId) => {
    set((state) => {
      const { [widgetId]: _removed, ...remainingWidgets } = state.widgets;
      return {
        widgets: remainingWidgets,
        layout: state.layout.filter((item) => item.i !== widgetId),
      };
    });

    get().saveToStorage();
  },

  // Update entire widget
  updateWidget: (widgetId, updates) => {
    set((state) => ({
      widgets: {
        ...state.widgets,
        [widgetId]: {
          ...state.widgets[widgetId],
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    }));

    get().saveToStorage();
  },

  // Update only widget config
  updateWidgetConfig: (widgetId, configUpdates) => {
    set((state) => {
      const widget = state.widgets[widgetId];
      if (!widget) return state;

      return {
        widgets: {
          ...state.widgets,
          [widgetId]: {
            ...widget,
            config: { ...widget.config, ...configUpdates },
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });

    get().saveToStorage();
  },

  // Update layout (from react-grid-layout)
  updateLayout: (newLayout) => {
    set({ layout: newLayout });
    get().saveToStorage();
  },

  // Toggle editing mode
  setIsEditing: (isEditing) => {
    set({ isEditing });
  },

  // Load from localStorage (temporary until Netlify DB is integrated)
  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('homeforge_dashboard');
      if (stored) {
        const data = JSON.parse(stored);
        set({
          layout: data.layout || [],
          widgets: data.widgets || {},
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard from storage:', error);
    }
  },

  // Save to localStorage (temporary until Netlify DB is integrated)
  saveToStorage: () => {
    try {
      const { layout, widgets } = get();
      localStorage.setItem(
        'homeforge_dashboard',
        JSON.stringify({ layout, widgets })
      );
    } catch (error) {
      console.error('Failed to save dashboard to storage:', error);
    }
  },
}));
