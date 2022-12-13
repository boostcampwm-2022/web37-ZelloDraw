import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ProtectRoute from '@components/route/ProtectRoute';
import Loading from '@components/Loading';

function App() {
    const Main = lazy(async () => await import('@pages/Main'));
    const Lobby = lazy(async () => await import('@pages/Lobby'));
    const Game = lazy(async () => await import('@pages/Game'));
    const ShareResult = lazy(async () => await import('@pages/ShareResult'));

    return (
        <RecoilRoot>
            <Suspense fallback={<Loading />}>
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
            </Suspense>
        </RecoilRoot>
    );
}

export default App;
