import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '@components/PrimaryButton';

export default function GameStartButton({ emitStartGame }: { emitStartGame: () => void }) {
    return (
        <ButtonWrapper onClick={emitStartGame} role={'button'} aria-label={'게임 시작하기'}>
            <PrimaryButton topText='START GAME' bottomText='시작하기' />
        </ButtonWrapper>
    );
}

const ButtonWrapper = styled.div`
    margin: auto 0 0 auto;
`;
