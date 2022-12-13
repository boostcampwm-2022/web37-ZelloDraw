import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { currentPageIdxState, isWatchedBookState, maxSketchbookState } from '@atoms/result';
import { ReactComponent as DownArrowIcon } from '@assets/icons/chevron-down.svg';
import { ReactComponent as UpArrowIcon } from '@assets/icons/chevron-up.svg';
import CurAndMaxNumber from '@components/CurAndMaxNumber';
import useResultSketchbook from '@hooks/useResultSketchbook';

function CurSketchbookPage({ isForShareResult }: { isForShareResult: boolean }) {
    const isWatchedSketchbook = useRecoilValue(isWatchedBookState);
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const { maxPageNum } = useRecoilValue(maxSketchbookState);
    const { addSketchbookPage, subtractSketchbookPage } = useResultSketchbook(isForShareResult);

    return (
        <CurPageWrapper>
            {isWatchedSketchbook && (
                <UpArrowWrapper disable={currentPageIdx === maxPageNum}>
                    <UpArrowIcon
                        onClick={addSketchbookPage}
                        role={'button'}
                        aria-label={'다음 스케치북 페이지 보기'}
                    />
                </UpArrowWrapper>
            )}
            <CurAndMaxNumber
                cur={currentPageIdx}
                max={maxPageNum}
                gradient={'whitePurple'}
                strokeColor={'primaryLight'}
            />
            {isWatchedSketchbook && (
                <DownArrowWrapper disable={currentPageIdx === 0}>
                    <DownArrowIcon
                        onClick={subtractSketchbookPage}
                        role={'button'}
                        aria-label={'이전 스케치북 페이지 보기'}
                    />
                </DownArrowWrapper>
            )}
        </CurPageWrapper>
    );
}

export default CurSketchbookPage;

const CurPageWrapper = styled(Center)`
    justify-content: end;
    flex-direction: column;
`;

const UpArrowWrapper = styled.div<{ disable: boolean }>`
    > svg {
        cursor: ${(props) => (props.disable ? 'not-allowed' : 'pointer')};
        opacity: ${(props) => (props.disable ? 0.4 : 1)};
        margin-bottom: -8px;
    }
`;
const DownArrowWrapper = styled.div<{ disable: boolean }>`
    > svg {
        cursor: ${(props) => (props.disable ? 'not-allowed' : 'pointer')};
        opacity: ${(props) => (props.disable ? 0.4 : 1)};
        margin-top: 8px;
    }
`;
