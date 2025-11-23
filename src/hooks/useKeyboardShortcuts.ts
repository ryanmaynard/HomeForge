import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          metaKey = false,
          shiftKey = false,
          altKey = false,
          action,
        } = shortcut;

        // Check if the shortcut matches
        const keyMatches = event.key.toLowerCase() === key.toLowerCase();
        const modifiersMatch =
          (ctrlKey === event.ctrlKey || metaKey === event.metaKey) &&
          shiftKey === event.shiftKey &&
          altKey === event.altKey;

        if (keyMatches && modifiersMatch) {
          event.preventDefault();
          action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

/**
 * Get platform-specific modifier key name
 */
export const getModifierKeyName = (): string => {
  return navigator.platform.indexOf('Mac') === 0 ? '⌘' : 'Ctrl';
};

/**
 * Format shortcut for display
 */
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];

  if (shortcut.ctrlKey || shortcut.metaKey) {
    parts.push(getModifierKeyName());
  }

  if (shortcut.shiftKey) {
    parts.push('Shift');
  }

  if (shortcut.altKey) {
    parts.push('Alt');
  }

  parts.push(shortcut.key.toUpperCase());

  return parts.join(' + ');
};
