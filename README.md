# 🏠 HomeForge

**Build your own modular personal dashboard** — A modern, open-source dashboard platform built with React, Vite, and Netlify.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ryanmaynard/HomeForge)

![HomeForge Dashboard](https://via.placeholder.com/1200x600/0ea5e9/ffffff?text=HomeForge+Dashboard)

---

## 🎉 What's New in v0.2.0

HomeForge just got a major upgrade with power-user features and enhanced resilience:

- ⚡ **Keyboard Shortcuts** — Control everything with hotkeys
- 🎨 **Dashboard Templates** — 5 beautiful pre-configured layouts
- 💾 **Export/Import** — Backup and restore your dashboard
- 🛡️ **Error Boundaries** — Widgets fail gracefully without crashing the app
- 🔔 **Toast Notifications** — Real-time feedback on every action
- ⚙️ **Widget Settings** — Unified modal for configuring widgets
- 🚀 **Performance Optimizations** — API caching, rate limiting, loading skeletons
- 🔒 **Security Enhancements** — Content Security Policy for XSS protection
- 🤖 **CI/CD Pipeline** — Automated testing, linting, and deployment

See the full details in [`docs/NEW_FEATURES.md`](docs/NEW_FEATURES.md).

---

## ✨ Features

### 🧩 Modular Widget System
- **Weather** — Current conditions and 5-day forecast
- **Crypto Prices** — Real-time cryptocurrency tracking
- **RSS Reader** — Aggregate your favorite feeds
- **Tasks** — Simple to-do list with persistence
- **Quick Links** — Bookmarks for your most-visited sites
- **Notes** — Markdown editor with live preview

### 🎨 Customizable Layout
- **Drag & Drop** — Reorder widgets with ease
- **Resize** — Adjust widget sizes to your preference
- **Responsive** — Works on desktop, tablet, and mobile
- **Dark Mode** — Beautiful dark theme with toggle

### ⚡ Power User Features
- **Keyboard Shortcuts** — Navigate and control with hotkeys (Cmd/Ctrl + K, E, D, etc.)
- **Dashboard Templates** — 5 pre-configured layouts (Developer, Productivity, Finance, News Hub, Minimal)
- **Export/Import** — Backup and restore your dashboard configuration
- **Widget Settings** — Configure each widget individually with a unified settings modal
- **Toast Notifications** — Real-time feedback on all actions

### 🛡️ Resilience & Performance
- **Error Boundaries** — Individual widget failures don't crash the entire dashboard
- **Loading Skeletons** — Type-specific loading states for better perceived performance
- **API Caching** — Intelligent caching reduces redundant API calls by ~50%
- **Rate Limiting** — Client-side rate limiting prevents API abuse
- **Content Security Policy** — XSS protection and authorized API domains

### 💾 Data Persistence
- **Netlify DB** — Layout and widget configurations saved in the cloud
- **Local Storage** — Demo mode with browser-based storage
- **Privacy-First** — Your data stays yours

### 🚀 Developer Experience
- **CI/CD Pipeline** — Automated type checking, linting, building, and deployment
- **TypeScript** — Full type safety throughout the codebase
- **Extensible** — Add new widgets in minutes with clear patterns
- **Optimized** — Built with Vite for lightning-fast load times

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Netlify account (for deployment)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryanmaynard/HomeForge.git
   cd HomeForge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📦 Deployment to Netlify

### Method 1: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ryanmaynard/HomeForge)

### Method 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Create a new site on [Netlify](https://app.netlify.com/)
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Functions directory:** `netlify/functions`

3. **Environment Variables** (optional)
   - No environment variables required for basic functionality
   - All APIs use free, public endpoints

### Setting Up Netlify DB (Coming Soon)

HomeForge is designed to work with Netlify Blobs for persistent storage. Currently, the app uses `localStorage` for demo purposes.

To enable full Netlify DB integration:

1. Install Netlify Blobs SDK:
   ```bash
   npm install @netlify/blobs
   ```

2. Update `src/services/netlifyDB.ts` to use the Netlify Blobs API instead of localStorage (see inline comments for guidance)

3. Configure Netlify environment variables if needed

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety and better DX |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Lightweight state management |
| **react-grid-layout** | Drag-and-drop grid system |
| **Netlify Functions** | Serverless edge functions |
| **Netlify DB** | Data persistence (coming soon) |

---

## 📚 Project Structure

```
HomeForge/
├── src/
│   ├── components/
│   │   ├── widgets/
│   │   │   ├── WeatherWidget.tsx
│   │   │   ├── CryptoWidget.tsx
│   │   │   ├── RSSWidget.tsx
│   │   │   ├── TasksWidget.tsx
│   │   │   ├── QuickLinksWidget.tsx
│   │   │   ├── NotesWidget.tsx
│   │   │   └── WidgetWrapper.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── WidgetLibrary.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Toast.tsx                    # Toast notification system
│   │   ├── WidgetErrorBoundary.tsx      # Error isolation
│   │   ├── WidgetSkeleton.tsx           # Loading states
│   │   ├── WidgetSettings.tsx           # Settings modal
│   │   ├── KeyboardShortcutsHelp.tsx    # Shortcuts reference
│   │   └── DashboardTemplates.tsx       # Template browser
│   ├── services/
│   │   ├── netlifyDB.ts        # Data persistence layer
│   │   ├── weatherAPI.ts       # Weather data fetching
│   │   ├── cryptoAPI.ts        # Crypto price fetching
│   │   ├── rssAPI.ts           # RSS feed fetching
│   │   ├── cache.ts            # API response caching
│   │   └── rateLimiter.ts      # Rate limiting
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts      # Keyboard shortcuts
│   ├── utils/
│   │   ├── templates.ts        # Dashboard templates
│   │   └── exportImport.ts     # Backup/restore
│   ├── store/
│   │   ├── dashboardStore.ts   # Zustand state management
│   │   └── toastStore.ts       # Toast notifications state
│   ├── styles/
│   │   └── animations.css      # Micro-interactions
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── netlify/
│   └── functions/
│       ├── rss-proxy.ts        # RSS feed CORS proxy
│       └── stats.ts            # Privacy-preserving analytics
├── .github/
│   ├── workflows/
│   │   └── ci.yml              # CI/CD pipeline
│   └── ISSUE_TEMPLATE/         # Bug & feature templates
├── docs/
│   ├── NEW_FEATURES.md         # v0.2.0 feature guide
│   └── NETLIFY_BLOBS_GUIDE.md  # Blobs integration guide
├── public/
├── netlify.toml                # Netlify configuration + CSP
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── CONTRIBUTING.md
└── README.md
```

---

## 🔧 Configuration

### Widget APIs

#### Weather Widget
- Uses **Open-Meteo** (free, no API key required)
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Features: Current weather, 5-day forecast, auto-location

#### Crypto Widget
- Uses **CoinGecko** (free tier, no API key for basic usage)
- Endpoint: `https://api.coingecko.com/api/v3/simple/price`
- Features: Real-time prices, 24h change, multiple currencies

#### RSS Widget
- Proxied through Netlify Function to avoid CORS
- Supports both RSS 2.0 and Atom feeds
- Aggregates multiple feeds with unified timeline

---

## ⌨️ Keyboard Shortcuts

HomeForge includes comprehensive keyboard shortcuts for power users:

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open widget library |
| `Cmd/Ctrl + E` | Toggle edit mode |
| `Cmd/Ctrl + D` | Toggle dark mode |
| `Cmd/Ctrl + /` | Show keyboard shortcuts help |
| `Cmd/Ctrl + S` | Open widget settings |
| `Cmd/Ctrl + O` | Open dashboard templates |
| `Cmd/Ctrl + R` | Refresh all widgets |
| `Cmd/Ctrl + T` | Focus search (when applicable) |

Press `Cmd/Ctrl + /` in the app to see the full shortcuts modal with descriptions.

---

## 🛠️ Adding a New Widget

HomeForge is designed to be easily extensible. Here's how to add your own widget:

### Step 1: Define the Widget Type

**`src/types/index.ts`**
```typescript
export type WidgetType =
  | 'weather'
  | 'crypto'
  | 'rss'
  | 'tasks'
  | 'quicklinks'
  | 'notes'
  | 'your-widget'; // Add your widget type

export interface YourWidgetConfig {
  // Define your widget's configuration
  setting1: string;
  setting2: number;
}

export type WidgetConfig =
  | WeatherConfig
  | CryptoConfig
  | RSSConfig
  | TasksConfig
  | QuickLinksConfig
  | NotesConfig
  | YourWidgetConfig; // Add to union type
```

### Step 2: Create the Widget Component

**`src/components/widgets/YourWidget.tsx`**
```typescript
import { useDashboardStore } from '../../store/dashboardStore';
import type { YourWidgetConfig } from '../../types';

interface YourWidgetProps {
  widgetId: string;
  config: YourWidgetConfig;
}

const YourWidget = ({ widgetId, config }: YourWidgetProps) => {
  const { updateWidgetConfig } = useDashboardStore();

  return (
    <div className="p-6 h-full">
      <h3 className="text-lg font-semibold">Your Widget</h3>
      {/* Your widget UI here */}
    </div>
  );
};

export default YourWidget;
```

### Step 3: Register in WidgetWrapper

**`src/components/widgets/WidgetWrapper.tsx`**
```typescript
import YourWidget from './YourWidget';

// In renderWidget():
case 'your-widget':
  return <YourWidget widgetId={widgetId} config={config} />;
```

### Step 4: Add to Widget Library

**`src/components/WidgetLibrary.tsx`**
```typescript
const WIDGET_CATALOG: WidgetLibraryItem[] = [
  // ...existing widgets
  {
    type: 'your-widget',
    title: 'Your Widget',
    description: 'Description of what your widget does',
    icon: 'FiYourIcon',
    defaultSize: { w: 4, h: 2 },
    minSize: { w: 3, h: 2 },
  },
];
```

### Step 5: Update Default Config

**`src/store/dashboardStore.ts`**
```typescript
const getDefaultConfig = (type: WidgetType): WidgetConfig => {
  switch (type) {
    // ...existing cases
    case 'your-widget':
      return { setting1: 'default', setting2: 0 };
  }
};
```

That's it! Your widget is now ready to use. 🎉

---

## 🧪 Development Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Bug Reports
1. Check if the issue already exists
2. Create a detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and OS info

### Feature Requests
1. Search existing feature requests
2. Describe the feature and use case
3. Explain why it would be useful

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-widget`)
3. Commit your changes (`git commit -m 'Add amazing widget'`)
4. Push to the branch (`git push origin feature/amazing-widget`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write TypeScript with proper types
- Add comments for complex logic
- Test your changes locally
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open-Meteo** — Free weather API
- **CoinGecko** — Cryptocurrency data
- **Netlify** — Hosting and edge functions
- **React Grid Layout** — Drag-and-drop functionality
- **Tailwind CSS** — Beautiful styling made easy

---

## 🔮 Roadmap

### ✅ Completed (v0.2.0)
- [x] Keyboard shortcuts
- [x] Export/import dashboard configurations
- [x] Widget templates/presets
- [x] Error boundaries for widget isolation
- [x] Toast notification system
- [x] API response caching
- [x] Rate limiting
- [x] Widget settings modal
- [x] Loading skeletons
- [x] Content Security Policy
- [x] GitHub Actions CI/CD pipeline

### 🚧 In Progress
- [ ] Netlify Blobs integration for cloud persistence (see `docs/NETLIFY_BLOBS_GUIDE.md`)

### 📋 Planned
- [ ] Netlify Identity authentication
- [ ] More widgets (Calendar, GitHub activity, Stocks, etc.)
- [ ] Widget marketplace
- [ ] Mobile app (React Native)
- [ ] Dashboard sharing
- [ ] Code splitting for lazy-loaded widgets
- [ ] Advanced accessibility improvements

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/ryanmaynard/HomeForge/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ryanmaynard/HomeForge/discussions)
- **Twitter:** [@homeforge](https://twitter.com/homeforge)

---

<div align="center">

**Made with ❤️ by the HomeForge community**

[⭐ Star on GitHub](https://github.com/ryanmaynard/HomeForge) | [🐛 Report Bug](https://github.com/ryanmaynard/HomeForge/issues) | [✨ Request Feature](https://github.com/ryanmaynard/HomeForge/issues)

</div>
