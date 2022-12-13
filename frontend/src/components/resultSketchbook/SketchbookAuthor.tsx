import styled from 'styled-components';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    bookDirectionState,
    currentBookIdxState,
    currentPageIdxState,
    isWatchedBookState,
    maxSketchbookState,
    sketchbookAuthorState,
} from '@atoms/result';
import { userState } from '@atoms/user';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/chevron-left-gradient.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/chevron-right-gradient.svg';
import bookMovedSound from '@assets/sounds/book-moved.wav';
import useSoundEffect from '@hooks/useSoundEffect';

interface SketchbookAuthorProps {
    isForShareResult: boolean;
    emitWatchResultSketchBook: (nextBookIdx: number) => void;
}

function SketchbookAuthor({ isForShareResult, emitWatchResultSketchBook }: SketchbookAuthorProps) {
    const authorName = useRecoilValue(sketchbookAuthorState);
    const { maxBookNum } = useRecoilValue(maxSketchbookState);
    const [currentBookIdx, setCurrentBookIdx] = useRecoilState(currentBookIdxState);
    const setCurrentPageIdx = useSetRecoilState(currentPageIdxState);
    const setBookDirection = useSetRecoilState(bookDirectionState);
    const setIsWatched = useSetRecoilState(isWatchedBookState);
    const { isHost } = useRecoilValue(userState);
    const { playSoundEffect } = useSoundEffect();

    function changeSketchbook(nextNum: 1 | -1) {
        setBookDirection(nextNum);
        const nextBookIdx = currentBookIdx + nextNum;

        playSoundEffect(bookMovedSound);

        if (isForShareResult) {
            setCurrentBookIdx(nextBookIdx);
            setCurrentPageIdx(0);
            setIsWatched(true);
        } else {
            emitWatchResultSketchBook(nextBookIdx);
        }
    }

    return (
        <>
            {isHost && currentBookIdx !== 0 && (
                <LeftArrowIcon
                    onClick={() => changeSketchbook(-1)}
                    role={'button'}
                    aria-label={'이전 유저 스케치북 보기'}
                />
            )}
            {isHost && currentBookIdx === 0 && <EmptySpan />}
            <Brace>{'{'}</Brace>
            <SketchbookAuthorName isHost={isHost}>{authorName}</SketchbookAuthorName>
            <Brace>{'}'}</Brace>
            <span>의 스케치북</span>
            {isHost && currentBookIdx === maxBookNum && <EmptySpan />}
            {isHost && currentBookIdx !== maxBookNum && (
                <RightArrowIcon
                    onClick={() => changeSketchbook(1)}
                    role={'button'}
                    aria-label={'다음 유저 스케치북 보기'}
                />
            )}
        </>
    );
}

export default SketchbookAuthor;

const SketchbookAuthorName = styled.span<{ isHost: boolean | null }>`
    background: ${(props) =>
        props.isHost ? props.theme.gradation.yellowPurple : props.theme.color.whiteT2};
    ${({ theme }) => theme.layout.gradientTypo}
`;

const Brace = styled.span`
    margin: 0 6px;
    font-family: 'Sniglet', cursive;
    font-weight: 700;
    font-size: ${({ theme }) => theme.typo.h1};
    transform: translateY(4px);
`;

const EmptySpan = styled.span`
    width: 30px;
    margin: 0 28px;
    transform: scale(1.3) translateY(2px);
`;
