import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '@pages/Main';
import Lobby from '@pages/Lobby';
import Game from '@pages/Game';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/lobby' element={<Lobby />} />
            <Route path='/game' element={<Game />} />
        </Routes>
    );
}

export default App;
