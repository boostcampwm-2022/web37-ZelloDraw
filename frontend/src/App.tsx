import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '@pages/Main';
import Lobby from '@pages/Lobby';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/lobby' element={<Lobby />} />
        </Routes>
    );
}

export default App;
