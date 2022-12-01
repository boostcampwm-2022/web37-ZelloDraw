import { Guide } from '@styles/styled';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import {
    currentBookIdxState,
    currentPageIdxState,
    isEndedState,
    isStartedState,
    maxSketchbookState,
} from '@atoms/result';
import { GUIDE_PAGE_IDX } from '@utils/constants';

function ResultGuide() {
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const isEnded = useRecoilValue(isEndedState);
    const isStarted = useRecoilValue(isStartedState);
    const { maxBookNum } = useRecoilValue(maxSketchbookState);

    const resultStartGuide = `모든 답이 제출되었어요.\n순서대로 하나씩 보여줄게요!`;
    const nextSketchbookGuide = '다음 스케치북 시작을 기다리고 있어요..';
    const EndGuide = `스케치북을 전부 확인했어요.\n새로운 주제로 한판 더 즐겨보세요!`;

    return (
        <Guide>
            <div>
                {isStarted && resultStartGuide}
                {!isEnded && currentPageIdx === GUIDE_PAGE_IDX && nextSketchbookGuide}
                {currentBookIdx === maxBookNum && currentPageIdx === GUIDE_PAGE_IDX && EndGuide}
            </div>
        </Guide>
    );
}

export default ResultGuide;
