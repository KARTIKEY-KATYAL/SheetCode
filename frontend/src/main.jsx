import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="sheetcode-theme">
      <BrowserRouter>
        <Toaster position="top-center" />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);