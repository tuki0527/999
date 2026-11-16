import type { UserProgress } from '../types/wiki';

const STORAGE_KEY = 'concept_lab_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  favorites: [],
  completedIds: [],
  storageAvailable: true,
};

export function loadUserProgress(): UserProgress {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_PROGRESS, storageAvailable: false };
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_PROGRESS, storageAvailable: true };
    }
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites.filter((x): x is string => typeof x === 'string')
        : [],
      completedIds: Array.isArray(parsed.completedIds)
        ? parsed.completedIds.filter((x): x is string => typeof x === 'string')
        : [],
      storageAvailable: true,
    };
  } catch {
    return { ...DEFAULT_PROGRESS, storageAvailable: false };
  }
}

export function saveUserProgress(progress: UserProgress): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        favorites: progress.favorites,
        completedIds: progress.completedIds,
      })
    );
    return true;
  } catch {
    return false;
  }
}

export function resetUserProgress(): UserProgress {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return { favorites: [], completedIds: [], storageAvailable: true };
  } catch {
    return { favorites: [], completedIds: [], storageAvailable: false };
  }
}
