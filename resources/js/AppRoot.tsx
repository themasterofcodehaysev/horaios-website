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
  PrayerPage,
  NotFoundPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages';
import AdminRouter from './admin/AdminRouter';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { ScrollToTop } from './components/common/ScrollToTop';

function App() {
  return (
    <SiteSettingsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ministries" element={<MinistriesPage />} />
          <Route path="/ministries/:id" element={<MinistryDetailPage />} />
          <Route path="/sermons" element={<SermonsPage />} />
          <Route path="/sermons/:id" element={<SermonDetailPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/songs/:id" element={<SongDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<BlogDetailPage />} />
          <Route path="/blog" element={<NewsPage />} />
          <Route path="/blogs" element={<NewsPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/visit" element={<VisitPage />} />
          <Route path="/give" element={<GivePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/prayer" element={<PrayerPage />} />
          <Route path="/prayer-requests" element={<PrayerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin/*" element={<AdminRouter />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </SiteSettingsProvider>
  );
}

export default App;
