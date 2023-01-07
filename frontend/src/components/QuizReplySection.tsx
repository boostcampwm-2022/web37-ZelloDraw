import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    isQuizTypeDrawState,
    isRoundTimeoutState,
    quizSubmitState,
    roundNumberState,
    userReplyState,
} from '@atoms/game';
import PrimaryButton from '@components/PrimaryButton';
import useZeroRound from '@hooks/useZeroRound';
import { debounce } from 'lodash';
import { SubmitQuizReplyRequest } from '@backend/core/game.dto';
import { EMPTY_CANVAS_IMG } from '@utils/constants';

function QuizReplySection({
    emitSubmitQuizReply,
}: {
    emitSubmitQuizReply: (quizReply: SubmitQuizReplyRequest) => void;
}) {
    const isDraw = useRecoilValue(isQuizTypeDrawState);
    const { curRound } = useRecoilValue(roundNumberState);
    const [submitAllowed, setSubmitAllowed] = useState(false);
    const [userReply, setUserReply] = useRecoilState(userReplyState);
    const [quizSubmitted, setQuizSubmitted] = useRecoilState(quizSubmitState);
    const { placeholder, sendRandomWordReplyToServer } = useZeroRound(emitSubmitQuizReply);
    const [isRoundTimeout, setIsRoundTimeout] = useRecoilState(isRoundTimeoutState);

    useEffect(() => {
        // 라운드가 새로 시작하면 초기화한다.
        setSubmitAllowed(false);
        setQuizSubmitted(false);
        setUserReply('');
        setIsRoundTimeout(false);
    }, [curRound]);

    useEffect(() => {
        if (isRoundTimeout) {
            submitBtnHandler();
        }
    }, [isRoundTimeout]);

    function submitBtnHandler() {
        if (curRound !== 0 && (userReply === '' || userReply === EMPTY_CANVAS_IMG)) {
            setSubmitAllowed(false);
            return;
        }
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

    const debounceOnChange = useCallback(
        debounce((value: string) => {
            setUserReply(value);
        }, 100),
        [],
    );

    function checkEnterKeyAndSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            submitBtnHandler();
        }
    }

    useEffect(() => {
        if (!submitAllowed && curRound !== 0 && userReply !== '' && userReply !== EMPTY_CANVAS_IMG)
            setSubmitAllowed(true);
    }, [userReply]);

    return (
        <Container>
            {!isDraw ? (
                <>
                    <label htmlFor='answer'>답변 입력</label>
                    <AnswerInput
                        id={'answer'}
                        placeholder={placeholder}
                        onChange={(e) => debounceOnChange(e.target.value)}
                        onKeyUp={(e) => checkEnterKeyAndSubmit(e)}
                        readOnly={quizSubmitted}
                        quizSubmitted={quizSubmitted}
                    />
                </>
            ) : (
                <div />
            )}
            <ButtonWrapper
                onClick={submitBtnHandler}
                role={'button'}
                aria-label={quizSubmitted ? '답 변경하기' : '답 제출하기'}
            >
                {quizSubmitted ? (
                    <PrimaryButton
                        topText={'EDIT'}
                        bottomText={'변경하기'}
                        allowed={curRound === 0 || submitAllowed}
                    />
                ) : (
                    <PrimaryButton
                        topText={'SUBMIT'}
                        bottomText={'제출하기'}
                        allowed={curRound === 0 || submitAllowed}
                    />
                )}
            </ButtonWrapper>
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
    label {
        position: absolute;
        opacity: 0;
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

const ButtonWrapper = styled.div`
    position: relative;
`;
