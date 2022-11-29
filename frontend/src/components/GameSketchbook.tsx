import SketchbookCard from '@components/SketchbookCard';
import RoundNumberAndTimer from '@components/RoundNumberAndTimer';
import DrawingTools from '@components/DrawingTools';
import QuizReplySection from '@components/QuizReplySection';
import useCanvas from '@hooks/useCanvas';
import usePrevQuizReply from '@hooks/usePrevQuizReply';
import { useRecoilValue } from 'recoil';
import { isQuizTypeDrawState, quizSubmitState } from '@atoms/game';
import styled from 'styled-components';

function GameSketchbook() {
    const { canvasRef, ...restProps } = useCanvas();
    const { renderPrevUserQuizReply } = usePrevQuizReply();
    const isDraw = useRecoilValue(isQuizTypeDrawState);
    const quizSubmitted = useRecoilValue(quizSubmitState);

    return (
        <>
            <SketchbookCard
                left={<RoundNumberAndTimer />}
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

const Canvas = styled.canvas`
    ${({ theme }) => theme.layout.sketchBook};
`;
