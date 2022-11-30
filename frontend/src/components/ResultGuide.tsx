import { Guide } from '@styles/styled';
import styled from 'styled-components';

interface ResultGuideType {
    sketchbookNum: number;
    pageNum: number;
    isEnded: boolean;
}

function ResultGuide({ sketchbookNum, pageNum, isEnded }: ResultGuideType) {
    const resultStartGuide = `모든 답이 제출되었어요.\n순서대로 하나씩 보여줄게요!`;
    const nextSketchbookGuide = '다음 스케치북 시작을 기다리고 있어요..';
    const EndGuide = `스케치북을 전부 확인했어요.\n새로운 주제로 한판 더 즐겨보세요!`;

    return (
        <Guide>
            <div>
                {sketchbookNum === 0 && pageNum === -1 && resultStartGuide}
                {!isEnded && sketchbookNum !== 0 && pageNum === -1 && nextSketchbookGuide}
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
