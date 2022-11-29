import { useEffect } from 'react';
import styled from 'styled-components';
import { ScaledDiv, ScaledSection } from '@styles/styled';
import { onCompleteGame, onCountSubmittedQuiz } from '@game/NetworkServiceUtils';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gameResultState, isQuizTypeDrawState, quizSubmitState } from '@atoms/game';
import QuizReplySection from '@components/QuizReplySection';
import DrawingTools from '@components/DrawingTools';
import RoundNumberAndTimer from '@components/RoundNumberAndTimer';
import SketchbookCard from '@components/SketchbookCard';
import GameUsers from '@components/GameUsers';
import MicButton from '@components/MicButton';
import CameraButton from '@components/CameraButton';
import useMovePage from '@hooks/useMovePage';
import SmallLogo from '@assets/logo-s.png';
import usePrevQuizReply from '@hooks/usePrevQuizReply';
import useCanvas from '@hooks/useCanvas';
import GameSketchbook from '@components/GameSketchbook';

function Game() {
    const [setPage] = useMovePage();
    const setGameResult = useSetRecoilState(gameResultState);

    useEffect(() => {
        onCountSubmittedQuiz();
        onCompleteGame(setGameResult);
    }, []);

    return (
        <>
            <Container>
                <GameUsers />
                <SketchbookSection>
                    <GameSketchbook />
                </SketchbookSection>
            </Container>
            <CamAndMicWrapper>
                <CameraButton />
                <MicButton />
            </CamAndMicWrapper>
            <LogoWrapper onClick={() => setPage('/')}>
                <img src={SmallLogo} />
            </LogoWrapper>
        </>
    );
}

export default Game;

const Container = styled(ScaledSection)`
    position: relative;
    padding: 48px 36px 40px 36px;
`;

const SketchbookSection = styled.div`
    margin-bottom: 140px;
`;

const CamAndMicWrapper = styled(ScaledDiv)`
    display: flex;
    position: absolute;
    bottom: 24px;
    left: 26px;

    > button {
        margin-right: 16px;
    }
`;

const LogoWrapper = styled(ScaledDiv)`
    justify-self: center;
    position: absolute;
    bottom: 40px;
    cursor: pointer;
`;
