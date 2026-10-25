import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// StrictMode intentionally omitted so the simulated verification effect (and its audit entry) runs exactly once.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
