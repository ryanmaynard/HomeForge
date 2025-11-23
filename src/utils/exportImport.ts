/**
 * Dashboard Export/Import Utilities
 *
 * Allows users to backup and restore their dashboard configurations
 */

import type { GridLayout, WidgetInstance } from '../types';

export interface DashboardExport {
  version: string;
  exportDate: string;
  layout: GridLayout[];
  widgets: Record<string, WidgetInstance>;
  theme: 'light' | 'dark';
}

/**
 * Export current dashboard configuration as JSON
 */
export const exportDashboard = (
  layout: GridLayout[],
  widgets: Record<string, WidgetInstance>,
  theme: 'light' | 'dark'
): void => {
  const exportData: DashboardExport = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    layout,
    widgets,
    theme,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `homeforge-dashboard-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import dashboard configuration from JSON file
 */
export const importDashboard = (file: File): Promise<DashboardExport> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as DashboardExport;

        // Validate the import data
        if (!data.version || !data.layout || !data.widgets) {
          throw new Error('Invalid dashboard configuration file');
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse dashboard configuration: ' + error));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Validate imported dashboard data
 */
export const validateDashboardImport = (data: DashboardExport): boolean => {
  // Check required fields
  if (!data.version || !data.layout || !data.widgets) {
    return false;
  }

  // Check layout is an array
  if (!Array.isArray(data.layout)) {
    return false;
  }

  // Check widgets is an object
  if (typeof data.widgets !== 'object') {
    return false;
  }

  // Validate each layout item
  for (const item of data.layout) {
    if (
      typeof item.i !== 'string' ||
      typeof item.x !== 'number' ||
      typeof item.y !== 'number' ||
      typeof item.w !== 'number' ||
      typeof item.h !== 'number'
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Merge imported dashboard with existing (useful for selective import)
 */
export const mergeDashboards = (
  existing: DashboardExport,
  imported: DashboardExport,
  strategy: 'replace' | 'append' = 'replace'
): DashboardExport => {
  if (strategy === 'replace') {
    return imported;
  }

  // Append strategy: keep existing and add imported
  const mergedWidgets = { ...existing.widgets };
  const mergedLayout = [...existing.layout];

  // Find max Y position in existing layout
  const maxY = existing.layout.length > 0
    ? Math.max(...existing.layout.map((item) => item.y + item.h))
    : 0;

  // Add imported widgets with offset Y positions
  for (const [widgetId, widget] of Object.entries(imported.widgets)) {
    const newId = `${widgetId}_imported_${Date.now()}`;
    mergedWidgets[newId] = { ...widget, id: newId };

    const layoutItem = imported.layout.find((item) => item.i === widgetId);
    if (layoutItem) {
      mergedLayout.push({
        ...layoutItem,
        i: newId,
        y: layoutItem.y + maxY,
      });
    }
  }

  return {
    ...existing,
    layout: mergedLayout,
    widgets: mergedWidgets,
  };
};
