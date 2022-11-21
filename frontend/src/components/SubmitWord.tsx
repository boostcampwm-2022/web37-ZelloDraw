import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilValue } from 'recoil';
import { roundDrawState, roundNumberState, roundWordState } from '@atoms/game';
import PrimaryButton from '@components/PrimaryButton';

export default function SubmitWord() {
    const isDraw = useRecoilValue(roundDrawState);
    const roundNum = useRecoilValue(roundNumberState);
    const roundWord = useRecoilValue(roundWordState);
    const [placeholder, setPlaceholder] = useState('그림을 보고 답을 맞춰보세요!');

    useEffect(() => {
        setRandomWordToPlaceholder();
    }, []);

    function setRandomWordToPlaceholder() {
        // 0번 라운드일때만 인풋 플레이스홀더에서 유저에게 랜덤 단어를 보여준다.
        if (roundNum === 0 && roundWord !== '') {
            setPlaceholder(roundWord);
        }
    }

    return (
        <Container>
            {!isDraw ? <AnswerInput placeholder={placeholder} /> : <div />}
            <PrimaryButton topText={'SUBMIT'} bottomText={'제출하기'} />
        </Container>
    );
}

const Container = styled(Center)`
    width: 1120px;
    margin-top: 26px;

    > div {
        width: 100%;
    }
`;

const AnswerInput = styled.input`
    flex-grow: 1;
    height: 48px;
    padding: 4px 20px;
    margin-right: 16px;
    background-color: ${({ theme }) => theme.color.blackT1};
    color: ${({ theme }) => theme.color.green};
    border: 1px solid ${({ theme }) => theme.color.yellow};
    border-radius: 20px;
    font-size: ${({ theme }) => theme.typo.h4};
    font-weight: 800;

    &::placeholder {
        color: ${({ theme }) => theme.color.gray1};
        font-weight: 500;
    }

    &:focus {
        border-color: ${({ theme }) => theme.color.green};
    }
`;
