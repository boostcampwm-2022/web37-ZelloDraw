import { Guide } from '@styles/styled';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { currentBookIdxState, currentPageIdxState, isEndedState } from '@atoms/result';

function ResultGuide() {
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const isEnded = useRecoilValue(isEndedState);

    const resultStartGuide = `모든 답이 제출되었어요.\n순서대로 하나씩 보여줄게요!`;
    const nextSketchbookGuide = '다음 스케치북 시작을 기다리고 있어요..';
    const EndGuide = `스케치북을 전부 확인했어요.\n새로운 주제로 한판 더 즐겨보세요!`;

    return (
        <Guide>
            <div>
                {currentBookIdx === 0 && currentPageIdx === -1 && resultStartGuide}
                {!isEnded && currentBookIdx !== 0 && currentPageIdx === -1 && nextSketchbookGuide}
                {isEnded && EndGuide}
            </div>
            {isEnded && <ReplayBtn>다시보기</ReplayBtn>}
        </Guide>
    );
}

export default ResultGuide;

const ReplayBtn = styled.button`
    position: absolute;
    bottom: -24px;
    color: ${({ theme }) => theme.color.primaryDark};
    font-size: ${({ theme }) => theme.typo.h4};
    font-weight: 600;
    border-bottom: 3px solid ${({ theme }) => theme.color.primaryDark};
`;
