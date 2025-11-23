// ============================================================================
// Core Types for HomeForge Dashboard
// ============================================================================

// ----------------------------------------------------------------------------
// User & Session
// ----------------------------------------------------------------------------

export interface User {
  id: string; // Could be Netlify Identity ID or anonymous UUID
  createdAt: string;
  theme?: 'light' | 'dark';
}

// ----------------------------------------------------------------------------
// Widget Types
// ----------------------------------------------------------------------------

export type WidgetType =
  | 'weather'
  | 'crypto'
  | 'rss'
  | 'tasks'
  | 'quicklinks'
  | 'notes';

// ----------------------------------------------------------------------------
// Layout & Grid System (react-grid-layout compatible)
// ----------------------------------------------------------------------------

export interface GridLayout {
  i: string; // Widget instance ID
  x: number;
  y: number;
  w: number; // Width in grid units
  h: number; // Height in grid units
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

export interface DashboardLayout {
  id: string;
  userId: string;
  layouts: {
    lg: GridLayout[];
    md?: GridLayout[];
    sm?: GridLayout[];
  };
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// Widget Instance & Configuration
// ----------------------------------------------------------------------------

export interface WidgetInstance {
  id: string; // Unique instance ID (UUID)
  type: WidgetType;
  userId: string;
  config: WidgetConfig; // Type-specific configuration
  createdAt: string;
  updatedAt: string;
}

// Type-specific configurations

export interface WeatherConfig {
  location: string; // City name or ZIP
  units: 'metric' | 'imperial';
}

export interface CryptoConfig {
  symbols: string[]; // ['BTC', 'ETH', 'SOL']
  currency: string; // 'USD', 'EUR', etc.
}

export interface RSSConfig {
  feeds: RSSFeed[];
  maxItems?: number;
}

export interface RSSFeed {
  url: string;
  title?: string; // User-friendly name
}

export interface TasksConfig {
  showCompleted: boolean;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  icon?: string; // Optional icon name or emoji
}

export interface QuickLinksConfig {
  links: QuickLink[];
}

export interface NotesConfig {
  content: string;
  lastSaved?: string;
}

// Union type for all widget configs
export type WidgetConfig =
  | WeatherConfig
  | CryptoConfig
  | RSSConfig
  | TasksConfig
  | QuickLinksConfig
  | NotesConfig;

// ----------------------------------------------------------------------------
// Task Management
// ----------------------------------------------------------------------------

export interface Task {
  id: string;
  widgetInstanceId: string; // Which task widget this belongs to
  userId: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  order: number; // For sorting
}

// ----------------------------------------------------------------------------
// API Response Types
// ----------------------------------------------------------------------------

// Weather API response (from Open-Meteo or similar)
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  forecast?: ForecastDay[];
  icon?: string;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon?: string;
}

// Crypto API response (from CoinGecko or similar)
export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
}

// RSS Feed item
export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  feedTitle?: string;
  feedUrl?: string;
}

// ----------------------------------------------------------------------------
// Netlify DB Store Keys
// ----------------------------------------------------------------------------

export const DB_STORES = {
  USERS: 'users',
  LAYOUTS: 'layouts',
  WIDGETS: 'widgets',
  TASKS: 'tasks',
} as const;

// ----------------------------------------------------------------------------
// Global Stats (Privacy-preserving)
// ----------------------------------------------------------------------------

export interface GlobalStats {
  totalWidgets: number;
  widgetTypeCount: Record<WidgetType, number>;
  totalUsers: number;
  lastUpdated: string;
}

// ----------------------------------------------------------------------------
// UI State Types
// ----------------------------------------------------------------------------

export interface DashboardState {
  userId: string;
  layout: GridLayout[];
  widgets: Record<string, WidgetInstance>; // Keyed by widget ID
  isEditing: boolean;
  theme: 'light' | 'dark';
}

export interface WidgetLibraryItem {
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  defaultSize: { w: number; h: number };
  minSize?: { w: number; h: number };
}

// ----------------------------------------------------------------------------
// API Client Types
// ----------------------------------------------------------------------------

export interface NetlifyDBClient {
  getLayout: (userId: string) => Promise<DashboardLayout | null>;
  saveLayout: (userId: string, layouts: DashboardLayout['layouts']) => Promise<void>;

  getWidget: (widgetId: string) => Promise<WidgetInstance | null>;
  getWidgets: (userId: string) => Promise<WidgetInstance[]>;
  saveWidget: (widget: WidgetInstance) => Promise<void>;
  deleteWidget: (widgetId: string) => Promise<void>;

  getTasks: (widgetInstanceId: string) => Promise<Task[]>;
  saveTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  getUser: (userId: string) => Promise<User | null>;
  saveUser: (user: User) => Promise<void>;
}

// ----------------------------------------------------------------------------
// Error Types
// ----------------------------------------------------------------------------

export class WidgetError extends Error {
  constructor(
    message: string,
    public widgetId: string,
    public widgetType: WidgetType
  ) {
    super(message);
    this.name = 'WidgetError';
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}
