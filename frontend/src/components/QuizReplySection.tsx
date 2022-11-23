import React, { useState } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isQuizTypeDrawState, quizSubmitState, roundNumberState } from '@atoms/game';
import PrimaryButton from '@components/PrimaryButton';
import { emitSubmitQuizReply } from '@game/NetworkServiceUtils';
import useZeroRound from '@hooks/useZeroRound';

function QuizReplySection() {
    const isDraw = useRecoilValue(isQuizTypeDrawState);
    const { curRound } = useRecoilValue(roundNumberState);
    const [userAnswer, setUserAnswer] = useState('');
    const [quizSubmitted, setQuizSubmitted] = useRecoilState(quizSubmitState);
    const { placeholder, sendRandomWordReplyToServer } = useZeroRound(curRound);

    function submitBtnHandler() {
        setQuizSubmitted(!quizSubmitted);
        // 변경하기 버튼을 누른 경우에는 return.
        if (quizSubmitted) return;

        if (userAnswer === '' && curRound === 0) {
            sendRandomWordReplyToServer();
            return;
        }

        sendUserWordReplyToServer();
    }

    function sendUserWordReplyToServer() {
        // 유저가 입력한 값이 서버로 제출된다.
        emitSubmitQuizReply({ quizReply: { type: 'ANSWER', content: userAnswer } });
    }

    return (
        <Container>
            {!isDraw ? (
                <AnswerInput
                    placeholder={placeholder}
                    onChange={(e) => setUserAnswer(e.target.value)}
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
