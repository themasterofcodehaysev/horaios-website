import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  HomePage,
  AboutPage,
  MinistriesPage,
  SermonsPage,
  SermonDetailPage,
  SongsPage,
  SongDetailPage,
  EventsPage,
  NewsPage,
  VisitPage,
  GivePage,
  ContactPage,
  NotFoundPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages';
import AdminRouter from './admin/AdminRouter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/ministries" element={<MinistriesPage />} />
        <Route path="/sermons" element={<SermonsPage />} />
        <Route path="/sermons/:slug" element={<SermonDetailPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/songs/:slug" element={<SongDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/visit" element={<VisitPage />} />
        <Route path="/give" element={<GivePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={<AdminRouter />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
