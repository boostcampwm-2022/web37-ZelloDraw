import React from 'react';
import styled from 'styled-components';
import { emitStartGame } from '@game/NetworkServiceUtils';
import PrimaryButton from '@components/PrimaryButton';

export default function GameStartButton({ lobbyId }: { lobbyId: string }) {
    const onClickStartBtn = () => {
        // 게임시작 이벤트 발생
        emitStartGame(lobbyId);
    };

    return (
        <ButtonWrapper onClick={onClickStartBtn} role={'button'} aria-label={'게임 시작하기'}>
            <PrimaryButton topText='START GAME' bottomText='시작하기' />
        </ButtonWrapper>
    );
}

const ButtonWrapper = styled.div`
    margin: auto 0 0 auto;
`;
