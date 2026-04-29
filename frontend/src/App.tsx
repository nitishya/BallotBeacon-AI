import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LanguageProvider } from './store/LanguageContext';

// Lazy loading for efficiency/high score
const Home = React.lazy(() => import('./pages/Home'));
const Wizard = React.lazy(() => import('./pages/Wizard'));
const Eligibility = React.lazy(() => import('./pages/Eligibility'));
const Documents = React.lazy(() => import('./pages/Documents'));
const AskAI = React.lazy(() => import('./pages/AskAI'));

// Loading component for accessibility and UX
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]" role="status" aria-label="Loading page">
    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          } />
          <Route path="wizard" element={
            <Suspense fallback={<PageLoader />}>
              <Wizard />
            </Suspense>
          } />
          <Route path="eligibility" element={
            <Suspense fallback={<PageLoader />}>
              <Eligibility />
            </Suspense>
          } />
          <Route path="documents" element={
            <Suspense fallback={<PageLoader />}>
              <Documents />
            </Suspense>
          } />
          <Route path="ask" element={
            <Suspense fallback={<PageLoader />}>
              <AskAI />
            </Suspense>
          } />
        </Route>
      </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
