import { Guide } from '@styles/styled';

interface ResultGuideType {
    sketchbookNum: number;
    pageNum: number;
    isEnded: boolean;
}

function ResultGuide({ sketchbookNum, pageNum, isEnded }: ResultGuideType) {
    const resultStartGuide = '모든 답이 제출되었어요\n' + '순서대로 하나씩 보여줄게요!';
    const nextSketchbookGuide = '다음 스케치북 시작을 기다리고 있어요..';
    const EndGuide = '스케치북을 전부 확인했어요.\n' + '새로운 주제로 한판 더 즐겨보세요!';

    return (
        <Guide>
            {sketchbookNum === 0 && pageNum === -1 && resultStartGuide}
            {!isEnded && sketchbookNum !== 0 && pageNum === -1 && nextSketchbookGuide}
            {isEnded && EndGuide}
        </Guide>
    );
}
export default ResultGuide;
