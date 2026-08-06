import React from 'react';
import { Navigation } from './Navigation';
import Footer from './Footer';

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
    <div className="flex flex-col min-h-screen bg-white">
      {!hideNavigation && <Navigation />}
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
