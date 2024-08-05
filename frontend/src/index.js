import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here
import App from './App'; // Adjust the import path as needed

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // Use createRoot instead of render
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
