import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { currentPageIdxState, currentSketchbookState, pageDirectionState } from '@atoms/result';
import useCheckGuidePage from '@hooks/useCheckGuidePage';
import { motion, AnimatePresence } from 'framer-motion';
import { flipVariants } from '@utils/framerMotion';

function QuizResultContent() {
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    const { checkIsNotGuidePage } = useCheckGuidePage();
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const pageDirection = useRecoilValue(pageDirectionState);

    return (
        <>
            {checkIsNotGuidePage() && (
                <AnimatePresence initial={false} custom={pageDirection}>
                    <QuizResult
                        key={currentPageIdx}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        variants={flipVariants}
                        custom={pageDirection}
                        transition={{ duration: 0.4 }}
                    >
                        {currentSketchbook.type === 'DRAW' ? (
                            currentSketchbook.content !== undefined ? (
                                <img src={currentSketchbook.content} alt={'quiz result content'} />
                            ) : (
                                <div>{'비어있어요 ;('}</div>
                            )
                        ) : (
                            <div>{currentSketchbook.content}</div>
                        )}
                    </QuizResult>
                </AnimatePresence>
            )}
        </>
    );
}

export default QuizResultContent;

const QuizResult = styled(motion(Center))`
    ${({ theme }) => theme.layout.sketchBook};
    transform-origin: top;

    > img {
        width: 100%;
        border-radius: 28px;
    }

    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: ${({ theme }) => theme.color.black};
        font-size: ${({ theme }) => theme.typo.h1};
        letter-spacing: 0.13rem;
        border-radius: 28px;
    }
`;
