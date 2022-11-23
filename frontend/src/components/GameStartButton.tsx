import React, { useEffect } from 'react';
import styled from 'styled-components';
import { emitStartGame, onStartGame } from '@game/NetworkServiceUtils';
import { useSetRecoilState } from 'recoil';
import { StartRoundEmitRequest } from '@backend/core/game.dto';
import { roundInfoState } from '@atoms/game';
import useMovePage from '@hooks/useMovePage';
import PrimaryButton from '@components/PrimaryButton';

export default function GameStartButton({ lobbyId }: { lobbyId: string }) {
    const [setPage] = useMovePage();
    const setRoundInfo = useSetRecoilState<StartRoundEmitRequest>(roundInfoState);

    const onClickStartBtn = () => {
        // 게임시작 이벤트 발생
        emitStartGame(lobbyId);
    };

    useEffect(() => {
        onStartGame(setPage, setRoundInfo);
    }, []);

    return (
        <ButtonWrapper onClick={onClickStartBtn}>
            <PrimaryButton topText='START GAME' bottomText='시작하기' />
        </ButtonWrapper>
    );
}

const ButtonWrapper = styled.div`
    margin: auto 0 0 auto;
`;
