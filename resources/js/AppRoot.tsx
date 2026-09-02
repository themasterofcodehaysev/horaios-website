import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  HomePage,
  AboutPage,
  MinistriesPage,
  MinistryDetailPage,
  SermonsPage,
  SermonDetailPage,
  SongsPage,
  SongDetailPage,
  EventsPage,
  EventDetailPage,
  NewsPage,
  BlogDetailPage,
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
        <Route path="/ministries/:slug" element={<MinistryDetailPage />} />
        <Route path="/sermons" element={<SermonsPage />} />
        <Route path="/sermons/:slug" element={<SermonDetailPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/songs/:slug" element={<SongDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<BlogDetailPage />} />
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
