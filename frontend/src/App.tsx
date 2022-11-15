import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '@pages/Main';
import Game from '@pages/Game';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/game' element={<Game />} />
        </Routes>
    );
}

export default App;
