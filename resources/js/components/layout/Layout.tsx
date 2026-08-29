import React from 'react';
import { Navigation } from './Navigation';
import Footer from './Footer';
import { PageBackground } from './PageBackground';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
  hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  hideNavigation = false,
  hideFooter = false,
}) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-brand-burgundy">
      <PageBackground />
      {!hideNavigation && <Navigation />}
      <main className="relative z-10 flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
