import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Main from '@pages/Main';
import Lobby from '@pages/Lobby';
import Game from '@pages/Game';
import ProtectRoute from '@components/route/ProtectRoute';
import { ShareResult } from '@pages/ShareResult';

function App() {
    return (
        <RecoilRoot>
            <Routes>
                <Route path='/' element={<Main />} />
                <Route
                    path='/lobby'
                    element={
                        <ProtectRoute>
                            <Lobby />
                        </ProtectRoute>
                    }
                />
                <Route
                    path='/game'
                    element={
                        <ProtectRoute>
                            <Game />
                        </ProtectRoute>
                    }
                />
                <Route path='/share-result/:id' element={<ShareResult />} />
                <Route path='/*' element={<Navigate to='/' replace={true} />} />
            </Routes>
        </RecoilRoot>
    );
}

export default App;
