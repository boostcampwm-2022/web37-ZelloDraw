import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { currentSketchbookState } from '@atoms/result';
import useCheckGuidePage from '@hooks/useCheckGuidePage';

function QuizResultContent() {
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    const { checkIsNotGuidePage } = useCheckGuidePage();

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
