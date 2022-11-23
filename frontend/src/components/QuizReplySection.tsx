import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    isQuizTypeDrawState,
    roundNumberState,
    quizReplyState,
    quizSubmitState,
} from '@atoms/game';
import PrimaryButton from '@components/PrimaryButton';

function QuizReplySection() {
    const isDraw = useRecoilValue(isQuizTypeDrawState);
    const { curRound } = useRecoilValue(roundNumberState);
    const quizReply = useRecoilValue(quizReplyState);
    const [placeholder, setPlaceholder] = useState('그림을 보고 답을 맞춰보세요!');
    const [userAnswer, setUserAnswer] = useState('');
    const [quizSubmitted, setQuizSubmitted] = useRecoilState(quizSubmitState);

    useEffect(() => {
        setRandomWordToPlaceholder();
    }, [quizReply]);

    function setRandomWordToPlaceholder() {
        // 0번 라운드일때만 인풋 플레이스홀더에서 유저에게 랜덤 단어를 보여준다.
        if (curRound === 0 && quizReply !== '') {
            setPlaceholder(quizReply);
        }
    }

    function writeAnswer(e: React.ChangeEvent<HTMLInputElement>) {
        setUserAnswer(e.target.value);
    }

    function submitBtnHandler() {
        if (quizSubmitted) {
            setQuizSubmitted(false);
            return;
        }
        setQuizSubmitted(true);

        // TODO: 몇명이나 제출했는지 확인하기 위해서 서버로 우선 전송, 내용 변경 후 다시 제출하면 다시 서버로 전송
        // 유저가 입력한 값이 없을 경우 전전 유저가 답한 word가 제출된다. (첫텀에는 랜덤 단어가 제출된다.)
        if (userAnswer === '') {
            console.log(quizReply);
            return;
        }

        // 유저가 입력한 값이 제출된다.
        console.log(userAnswer);
    }

    return (
        <Container>
            {!isDraw ? (
                <AnswerInput
                    placeholder={placeholder}
                    onChange={writeAnswer}
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
