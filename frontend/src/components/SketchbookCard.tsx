import styled from 'styled-components';
import { Center } from '@styles/styled';
import { ReactComponent as Sketchbook } from '@assets/sketchbook.svg';
import { useRecoilValue } from 'recoil';
import { isQuizTypeDrawState, roundNumberState, quizSubmitState } from '@atoms/game';
import useCanvas from '@hooks/useCanvas';
import Card from '@components/Card';
import Timer from '@components/Timer';
import DrawingTools from '@components/DrawingTools';
import usePrevQuizReply from '@hooks/usePrevQuizReply';

function SketchbookCard() {
    const { canvasRef, ...restProps } = useCanvas();
    const isDraw = useRecoilValue(isQuizTypeDrawState);
    const { curRound, maxRound } = useRecoilValue(roundNumberState);
    const quizSubmitted = useRecoilValue(quizSubmitState);
    const { renderPrevUserQuizReply } = usePrevQuizReply();

    return (
        <Card>
            <Container>
                <GameStateSection>
                    <GameTurn>
                        {curRound}/{maxRound}
                    </GameTurn>
                    <Timer />
                </GameStateSection>
                <SketchbookWrapper>
                    <Sketchbook />
                    <Canvas ref={canvasRef} />
                    {renderPrevUserQuizReply()}
                </SketchbookWrapper>
                {isDraw && !quizSubmitted ? <DrawingTools restProps={restProps} /> : <div />}
            </Container>
        </Card>
    );
}

export default SketchbookCard;

const Container = styled(Center)`
    padding: 44px 38px 0 28px;

    > div:last-of-type {
        width: 100%;
    }
`;

const GameStateSection = styled.div`
    display: flex;
    align-items: end;
`;

const GameTurn = styled.div`
    height: 45px;
    margin-right: 32px;
    background: ${({ theme }) => theme.gradation.primaryLightBrown};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-text-stroke: 1px ${({ theme }) => theme.color.blackT1};
    text-stroke: 1px ${({ theme }) => theme.color.blackT1};
    font-family: 'Sniglet', cursive;
    font-weight: 800;
    font-size: 1.75rem;
    letter-spacing: 0.05rem;
    transform: translateY(16px);
`;

const SketchbookWrapper = styled.div`
    position: relative;
    margin: 0 30px;
`;

const Canvas = styled.canvas`
    ${({ theme }) => theme.layout.sketchBook};
`;
