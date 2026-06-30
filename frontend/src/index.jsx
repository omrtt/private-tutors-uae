import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <HelmetProvider>
      <AuthProvider>
        <DarkModeProvider>
          <App />
          <Toaster position="top-center" />
        </DarkModeProvider>
      </AuthProvider>
    </HelmetProvider>
  </BrowserRouter>
);
