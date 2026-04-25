/**
 * App — top-level route table.
 *
 * Home is eagerly imported so the landing route paints fast; ProjectDetails
 * and NotFound are code-split via React.lazy + Suspense so they only ship
 * to the client on demand. This keeps the initial bundle lean and makes
 * back-navigation from a project page snappy (Home is already in cache).
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const NotFound = lazy(() => import('./components/NotFound'));

const Fallback: React.FC = () => (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#050507' }}>
        <span className="mono text-[11px] tracking-[0.4em] uppercase" style={{ color: '#36f9b3' }}>loading</span>
    </div>
);

const App: React.FC = () => (
    <Suspense fallback={<Fallback />}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Suspense>
);

export default App;
