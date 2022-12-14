import ResultSketchbook from '@components/resultSketchbook/ResultSketchbook';
import SmallLogo from '@assets/zellodraw-logo.png';
import styled from 'styled-components';
import { ScaledSection } from '@styles/styled';
import { useEffect } from 'react';
import { queryAndSaveGameResult } from '@axios/sharedResult';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { gameResultIdState, gameResultState, isWatchedBookState } from '@atoms/result';
import { userState } from '@atoms/user';
import { useParams } from 'react-router-dom';
import useMovePage from '@hooks/useMovePage';

export default function ShareResult() {
    const [setPage] = useMovePage();
    const [gameResult, setGameResult] = useRecoilState(gameResultState);
    const [user, setUser] = useRecoilState(userState);
    const setIsWatched = useSetRecoilState(isWatchedBookState);
    const gameResultId = useParams().id;
    const setGameResultId = useSetRecoilState(gameResultIdState);

    useEffect(() => {
        if (gameResultId === undefined) setPage('/');
        else {
            void queryAndSaveGameResult(setGameResult, gameResultId)
                .then(() => {
                    setGameResultId(gameResultId);
                    setIsWatched(true);
                    setUser({ ...user, isHost: true });
                })
                .catch(() => {
                    alert('존재하지 않는 게임 결과입니다.');
                    setPage('/');
                });
        }
    }, []);
    return (
        <>
            <Container>
                <SketchbookSection>
                    {gameResult && <ResultSketchbook isForShareResult={true} />}
                </SketchbookSection>
            </Container>
            <LogoWrapper>
                <img src={SmallLogo} alt={'Logo'} width={363} height={75} />
            </LogoWrapper>
        </>
    );
}

const Container = styled(ScaledSection)`
    position: relative;
    padding: 48px 36px 40px 36px;
`;

const SketchbookSection = styled.div`
    margin-bottom: 140px;
`;

const LogoWrapper = styled.div`
    justify-self: center;
    position: absolute;
    bottom: 40px;
    cursor: pointer;
`;
