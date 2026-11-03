import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import { getAuth } from './lib/api';

const Pricing = lazy(() => import('./pages/Pricing'));
const Profit = lazy(() => import('./pages/Profit'));
const ROI = lazy(() => import('./pages/ROI'));
const Receipts = lazy(() => import('./pages/Receipts'));
const PhoneGuide = lazy(() => import('./pages/PhoneGuide'));
const AdDoctor = lazy(() => import('./pages/AdDoctor'));
const ProductFinder = lazy(() => import('./pages/ProductFinder'));

function Loading() {
  return (
    <div className="flex h-[50vh] items-center justify-center text-ink-mute">
      <Loader2 className="animate-spin" />
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => !!getAuth());

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/profit" element={<Profit />} />
            <Route path="/roi" element={<ROI />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/phone-ads" element={<PhoneGuide />} />
            <Route path="/phone-ads/:lessonId" element={<PhoneGuide />} />
            <Route path="/ad-doctor" element={<AdDoctor />} />
            <Route path="/product-finder" element={<ProductFinder />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
