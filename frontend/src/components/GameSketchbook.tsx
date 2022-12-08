import SketchbookCard from '@components/SketchbookCard';
import DrawingTools from '@components/DrawingTools';
import QuizReplySection from '@components/QuizReplySection';
import useCanvas from '@hooks/useCanvas';
import usePrevQuizReply from '@hooks/usePrevQuizReply';
import { useRecoilValue } from 'recoil';
import {
    isQuizTypeDrawState,
    quizSubmitState,
    roundNumberState,
    submittedQuizReplyCountState,
    userListLengthState,
} from '@atoms/game';
import styled from 'styled-components';
import CurAndMaxNumber from '@components/CurAndMaxNumber';
import Timer from '@components/Timer';

function GameSketchbook() {
    const { canvasRef, ...restProps } = useCanvas();
    const { renderPrevUserQuizReply } = usePrevQuizReply();
    const isDraw = useRecoilValue(isQuizTypeDrawState);
    const { curRound, maxRound } = useRecoilValue(roundNumberState);
    const submittedCount = useRecoilValue(submittedQuizReplyCountState);
    const userListLength = useRecoilValue(userListLengthState);
    const quizSubmitted = useRecoilValue(quizSubmitState);

    return (
        <>
            <SketchbookCard
                left={
                    <>
                        <RoundInfo>
                            <RoundWrapper>
                                <div>ROUND</div>
                                <CurAndMaxNumber
                                    cur={curRound}
                                    max={maxRound}
                                    gradient={'primaryLightBrown'}
                                    strokeColor={'black'}
                                />
                            </RoundWrapper>
                            {submittedCount > 0 ? (
                                <CurAndMaxNumber
                                    cur={submittedCount}
                                    max={userListLength}
                                    gradient={'yellowGreen'}
                                    strokeColor={'blackT1'}
                                />
                            ) : (
                                <div />
                            )}
                        </RoundInfo>
                        <Timer />
                    </>
                }
                center={
                    <>
                        <Canvas ref={canvasRef} />
                        {renderPrevUserQuizReply()}
                    </>
                }
                right={isDraw && !quizSubmitted && <DrawingTools restProps={restProps} />}
            />
            <QuizReplySection />
        </>
    );
}
export default GameSketchbook;

const RoundInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 492px;
`;

const RoundWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    > div:first-of-type {
        height: 45px;
        margin-top: -48px;
        margin-bottom: -32px;
        background: ${({ theme }) => theme.gradation.primaryLightBrown};
        ${({ theme }) => theme.layout.gradientTypo}
        -webkit-text-stroke: 1px ${({ theme }) => theme.color.black};
        font-family: 'Sniglet', cursive;
        font-weight: 800;
        font-size: 1.75rem;
    }
`;

const Canvas = styled.canvas`
    ${({ theme }) => theme.layout.sketchBook};
`;
