import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    isQuizTypeDrawState,
    quizSubmitState,
    roundNumberState,
    userReplyState,
} from '@atoms/game';
import PrimaryButton from '@components/PrimaryButton';
import { emitSubmitQuizReply } from '@game/NetworkServiceUtils';
import useZeroRound from '@hooks/useZeroRound';
import useRoundTimeout from '@hooks/useRoundTimeout';

function QuizReplySection() {
    const isDraw = useRecoilValue(isQuizTypeDrawState);
    const { curRound } = useRecoilValue(roundNumberState);
    const [userReply, setUserReply] = useRecoilState(userReplyState);
    const [quizSubmitted, setQuizSubmitted] = useRecoilState(quizSubmitState);
    const { placeholder, sendRandomWordReplyToServer } = useZeroRound(curRound);
    const { isRoundTimeout } = useRoundTimeout();

    useEffect(() => {
        // 라운드가 새로 시작하면 제출 상태와 유저 답변을 초기화한다.
        setQuizSubmitted(false);
        setUserReply('');
    }, [curRound]);

    useEffect(() => {
        if (isRoundTimeout) {
            sendUserReplyToServer();
        }
    }, [isRoundTimeout]);

    function submitBtnHandler() {
        setQuizSubmitted(!quizSubmitted);
        // 변경하기 버튼을 누른 경우에는 return.
        if (quizSubmitted) return;

        if (curRound === 0 && userReply === '') {
            sendRandomWordReplyToServer();
            return;
        }

        sendUserReplyToServer();
    }

    function sendUserReplyToServer() {
        // 유저가 입력한 값이 서버로 제출된다.
        emitSubmitQuizReply({
            quizReply: { type: isDraw ? 'DRAW' : 'ANSWER', content: userReply },
        });
    }

    return (
        <Container>
            {!isDraw ? (
                <AnswerInput
                    placeholder={placeholder}
                    onChange={(e) => setUserReply(e.target.value)}
                    readOnly={quizSubmitted}
                    quizSubmitted={quizSubmitted}
                />
            ) : (
                <div />
            )}
            <div onClick={submitBtnHandler}>
                {quizSubmitted ? (
                    <PrimaryButton topText={'EDIT'} bottomText={'변경하기'} />
                ) : (
                    <PrimaryButton topText={'SUBMIT'} bottomText={'제출하기'} />
                )}
            </div>
        </Container>
    );
}

export default QuizReplySection;

const Container = styled(Center)`
    width: 1120px;
    margin-top: 26px;

    > div:first-child {
        width: 100%;
    }
`;

const AnswerInput = styled.input<{ quizSubmitted: boolean }>`
    flex-grow: 1;
    height: 48px;
    padding: 4px 20px;
    margin-right: 16px;
    background-color: ${({ theme }) => theme.color.blackT1};
    color: ${(props) => (props.quizSubmitted ? props.theme.color.gray1 : props.theme.color.green)};
    border: 1px solid ${({ theme }) => theme.color.yellow};
    border-radius: 20px;
    font-size: ${({ theme }) => theme.typo.h4};
    font-weight: 800;

    &::placeholder {
        color: ${({ theme }) => theme.color.gray1};
        font-weight: 500;
    }

    &:focus {
        border-color: ${(props) =>
            props.quizSubmitted ? props.theme.color.yellow : props.theme.color.green};
    }
`;
