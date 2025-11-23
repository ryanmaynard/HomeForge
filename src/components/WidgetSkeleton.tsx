import type { WidgetType } from '../types';

interface WidgetSkeletonProps {
  type: WidgetType;
}

const WidgetSkeleton = ({ type }: WidgetSkeletonProps) => {
  switch (type) {
    case 'weather':
      return <WeatherSkeleton />;
    case 'crypto':
      return <CryptoSkeleton />;
    case 'rss':
      return <RSSSkeleton />;
    case 'tasks':
      return <TasksSkeleton />;
    case 'quicklinks':
      return <QuickLinksSkeleton />;
    case 'notes':
      return <NotesSkeleton />;
    default:
      return <GenericSkeleton />;
  }
};

const WeatherSkeleton = () => (
  <div className="p-6 h-full animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8" />
    </div>

    {/* Current weather */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      </div>
      <div className="h-16 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
    </div>

    {/* Details */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>

    {/* Forecast */}
    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
      <div className="grid grid-cols-5 gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12 mx-auto mb-2" />
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-8 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CryptoSkeleton = () => (
  <div className="p-6 h-full animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8" />
    </div>

    {/* Crypto items */}
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-1" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12" />
            </div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RSSSkeleton = () => (
  <div className="p-6 h-full animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8" />
    </div>

    {/* RSS items */}
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32" />
        </div>
      ))}
    </div>
  </div>
);

const TasksSkeleton = () => (
  <div className="p-6 h-full animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-1" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      </div>
      <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>

    {/* Task items */}
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded border-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
        </div>
      ))}
    </div>
  </div>
);

const QuickLinksSkeleton = () => (
  <div className="p-6 h-full animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4" />
    </div>

    {/* Link items */}
    <div className="grid grid-cols-1 gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const NotesSkeleton = () => (
  <div className="h-full animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32" />
    </div>

    {/* Content */}
    <div className="p-6 space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
    </div>
  </div>
);

const GenericSkeleton = () => (
  <div className="p-6 h-full animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
    </div>
  </div>
);

export default WidgetSkeleton;
