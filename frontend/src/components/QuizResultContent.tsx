import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { currentPageIdxState, currentSketchbookState, isEndedState } from '@atoms/result';

function QuizResultContent() {
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const isEnded = useRecoilValue(isEndedState);
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    const guidePageIdx = -1;

    function checkIsNotGuidePage() {
        return currentPageIdx > guidePageIdx && !isEnded;
    }
    return (
        <>
            {checkIsNotGuidePage() && (
                <QuizResult>
                    {currentSketchbook.type === 'DRAW' ? (
                        <img src={currentSketchbook.content} />
                    ) : (
                        <div>{currentSketchbook.content}</div>
                    )}
                </QuizResult>
            )}
        </>
    );
}

export default QuizResultContent;

const QuizResult = styled(Center)`
    ${({ theme }) => theme.layout.sketchBook};
    > img {
        width: 100%;
    }

    > div {
        color: ${({ theme }) => theme.color.black};
        font-size: ${({ theme }) => theme.typo.h1};
        letter-spacing: 0.13rem;
    }
`;
