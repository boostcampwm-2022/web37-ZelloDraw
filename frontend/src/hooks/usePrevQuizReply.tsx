import { useRecoilValue } from 'recoil';
import { isQuizTypeDrawState, quizReplyState, roundNumberState } from '@atoms/game';
import useZeroRound from '@hooks/useZeroRound';
import styled from 'styled-components';

function usePrevQuizReply() {
    const isDraw = useRecoilValue(isQuizTypeDrawState);
    const quizReply = useRecoilValue(quizReplyState);
    const { curRound } = useRecoilValue(roundNumberState);
    const { renderZeroRoundGuide } = useZeroRound();

    const renderPrevUserQuizReply = () => {
        if (isDraw) {
            return (
                <Keyword>
                    <span>{quizReply}</span>
                </Keyword>
            );
        }

        if (curRound === 0) {
            return renderZeroRoundGuide();
        }

        return (
            <UserDrawing>
                {quizReply.length > 100 && <img src={quizReply} alt='quiz reply drawing' />}
            </UserDrawing>
        );
    };

    return { renderPrevUserQuizReply };
}

export default usePrevQuizReply;

const Keyword = styled.div`
    position: absolute;
    top: 71px;
    left: 50%;
    padding: 2px 8px;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.color.blackT1};
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.color.purple};

    span {
        background: ${({ theme }) => theme.gradation.whitePurple};
        ${({ theme }) => theme.layout.gradientTypo};
        font-size: ${({ theme }) => theme.typo.h4};
    }
`;

const UserDrawing = styled.div`
    ${({ theme }) => theme.layout.sketchBook};
    > img {
        border-radius: 28px;
    }
`;
