import '@vitejs/plugin-react/preamble';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth';
import Layout from './layout';
import '../css/app.css';

createRoot(document.getElementById('app')).render(
    <BrowserRouter>
        <AuthProvider>
            <Layout />
        </AuthProvider>
    </BrowserRouter>
);
