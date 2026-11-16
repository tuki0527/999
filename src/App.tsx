/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { getAllConcepts } from './lib/contentLoader';
import {
  loadUserProgress,
  resetUserProgress,
  saveUserProgress,
} from './lib/storage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { SlidesPage } from './pages/SlidesPage';
import { SourcesAndProcessPage } from './pages/SourcesAndProcessPage';

function AppRoutes() {
  const concepts = useMemo(() => getAllConcepts(), []);
  const [progress, setProgress] = useState(() => loadUserProgress());
  const location = useLocation();

  const toggleFavorite = (id: string) => {
    setProgress((prev) => {
      const exists = prev.favorites.includes(id);
      const favorites = exists
        ? prev.favorites.filter((x) => x !== id)
        : [...prev.favorites, id];
      const next = { ...prev, favorites };
      const saved = saveUserProgress(next);
      return { ...next, storageAvailable: saved };
    });
  };

  const toggleComplete = (id: string) => {
    setProgress((prev) => {
      const exists = prev.completedIds.includes(id);
      const completedIds = exists
        ? prev.completedIds.filter((x) => x !== id)
        : [...prev.completedIds, id];
      const next = { ...prev, completedIds };
      const saved = saveUserProgress(next);
      return { ...next, storageAvailable: saved };
    });
  };

  const handleResetProgress = () => {
    setProgress(resetUserProgress());
  };

  const showSidebar =
    location.pathname === '/' ||
    location.pathname === '/wiki' ||
    location.pathname.startsWith('/wiki/');

  return (
    <Layout concepts={concepts} progress={progress} showSidebar={showSidebar}>
      <Routes>
        <Route
          path="/"
          element={
            <KnowledgeBasePage
              concepts={concepts}
              progress={progress}
              onToggleFavorite={toggleFavorite}
              onToggleComplete={toggleComplete}
              onResetProgress={handleResetProgress}
            />
          }
        />
        <Route
          path="/wiki"
          element={
            <KnowledgeBasePage
              concepts={concepts}
              progress={progress}
              onToggleFavorite={toggleFavorite}
              onToggleComplete={toggleComplete}
              onResetProgress={handleResetProgress}
            />
          }
        />
        <Route
          path="/wiki/:slug"
          element={
            <KnowledgeBasePage
              concepts={concepts}
              progress={progress}
              onToggleFavorite={toggleFavorite}
              onToggleComplete={toggleComplete}
              onResetProgress={handleResetProgress}
            />
          }
        />
        <Route path="/slides" element={<SlidesPage concepts={concepts} />} />
        <Route path="/process" element={<SourcesAndProcessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
