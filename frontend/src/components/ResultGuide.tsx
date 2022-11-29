import { Guide } from '@styles/styled';

function ResultGuide({ sketchbookNum, pageNum }: { sketchbookNum: number; pageNum: number }) {
    const resultStartGuide = '모든 답이 제출되었어요\n' + '순서대로 하나씩 보여줄게요!';
    const sketchbookEndGuide = '다음 스케치북 시작을 기다리고 있어요..';
    return (
        <Guide>
            {sketchbookNum === 0 && pageNum === -1 && resultStartGuide}
            {sketchbookNum !== 0 && pageNum === -1 && sketchbookEndGuide}
        </Guide>
    );
}
export default ResultGuide;
