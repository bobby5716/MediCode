import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import CursorLayer from './components/layout/CursorLayer';
import AlertListener from './components/layout/AlertListener';
import useBrowserNotifications from './hooks/useBrowserNotifications';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Playground3D from './pages/Playground3D';
import History from './pages/History';
import TaskDetail from './pages/TaskDetail';
import Alerts from './pages/Alerts';
import PatientTimeline from './pages/PatientTimeline';
import Records from './pages/Records';
import UploadRecord from './pages/UploadRecord';
import ReviewRecord from './pages/ReviewRecord';
import RecordDetail from './pages/RecordDetail';
import TeamIntro from './pages/TeamIntro';
import GuestReport from './pages/GuestReport';
import ClinicalNotes from './pages/modules/ClinicalNotes';
import LabExplainer from './pages/modules/LabExplainer';
import Triage from './pages/modules/Triage';
import Medication from './pages/modules/Medication';
import ResourceForecast from './pages/modules/ResourceForecast';
import AmbientVisit from './pages/modules/AmbientVisit';
import { LanguageProvider, LanguageSwitcher } from './context/LanguageContext';

function InnerApp() {
  useBrowserNotifications();

  return (
    <>
      <CursorLayer />
      <AlertListener />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0f',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '13px',
            borderRadius: '12px',
          },
        }}
      />
      <BrowserRouter>
        <LanguageHeader />
        <Routes>
          {/* 1. Team Intro — first thing judges see */}
          <Route path="/" element={<TeamIntro />} />

          {/* 2. Original cinematic MediCore landing page */}
          <Route path="/home" element={<Home />} />
          <Route path="/try-report" element={<GuestReport />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* App */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
          <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute><PatientTimeline /></PrivateRoute>} />

          {/* Medical Records */}
          <Route path="/records" element={<PrivateRoute><Records /></PrivateRoute>} />
          <Route path="/records/upload" element={<PrivateRoute><UploadRecord /></PrivateRoute>} />
          <Route path="/records/:id" element={<PrivateRoute><RecordDetail /></PrivateRoute>} />
          <Route path="/records/:id/review" element={<PrivateRoute><ReviewRecord /></PrivateRoute>} />

          {/* AI Modules */}
          <Route path="/modules/ambient-visit" element={<PrivateRoute><AmbientVisit /></PrivateRoute>} />
          <Route path="/modules/clinical-notes" element={<PrivateRoute><ClinicalNotes /></PrivateRoute>} />
          <Route path="/modules/lab-explainer" element={<PrivateRoute><LabExplainer /></PrivateRoute>} />
          <Route path="/modules/triage" element={<PrivateRoute><Triage /></PrivateRoute>} />
          <Route path="/modules/medication" element={<PrivateRoute><Medication /></PrivateRoute>} />
          <Route path="/modules/resource-forecast" element={<PrivateRoute><ResourceForecast /></PrivateRoute>} />

          <Route path="/3d" element={<Playground3D />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function LanguageHeader() {
  const { pathname } = useLocation();
  // The landing page has its own navigation header, which includes the picker.
  if (pathname === '/home') return null;
  return (
    <header className="relative z-[200] flex justify-end px-4 pt-3">
      <LanguageSwitcher />
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <InnerApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
