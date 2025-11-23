import { useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import { useDashboardStore } from '../store/dashboardStore';
import DashboardHeader from './DashboardHeader';
import WidgetWrapper from './widgets/WidgetWrapper';
import EmptyState from './EmptyState';

// Import react-grid-layout styles
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const Dashboard = () => {
  const { layout, widgets, isEditing, updateLayout } = useDashboardStore();

  // Convert store layout to react-grid-layout format
  const gridLayout = useMemo(() => layout, [layout]);

  const handleLayoutChange = (newLayout: GridLayout.Layout[]) => {
    // Only update if in editing mode to avoid unnecessary updates during resize
    if (isEditing) {
      updateLayout(newLayout);
    }
  };

  const widgetIds = Object.keys(widgets);
  const hasWidgets = widgetIds.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasWidgets ? (
          <EmptyState />
        ) : (
          <GridLayout
            className="layout"
            layout={gridLayout}
            cols={12}
            rowHeight={100}
            width={1200}
            onLayoutChange={handleLayoutChange}
            isDraggable={isEditing}
            isResizable={isEditing}
            compactType="vertical"
            preventCollision={false}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            useCSSTransforms={true}
            draggableHandle=".widget-drag-handle"
          >
            {gridLayout.map((item) => {
              const widget = widgets[item.i];
              if (!widget) return null;

              return (
                <div key={item.i} className="widget-grid-item">
                  <WidgetWrapper
                    widgetId={widget.id}
                    type={widget.type}
                    config={widget.config}
                    isEditing={isEditing}
                  />
                </div>
              );
            })}
          </GridLayout>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Built with ❤️ using React, Vite, and Netlify •{' '}
            <a
              href="https://github.com/ryanmaynard/HomeForge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
