import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ZelloTheme } from './styles/ZelloTheme';
import { GlobalStyle } from '@styles/GlobalStyle';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={ZelloTheme}>
                <App />
                <GlobalStyle />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
