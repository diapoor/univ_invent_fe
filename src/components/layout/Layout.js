import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="layout-container">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
