import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '@components/Card';
import GameModeItem from '@components/GameModeItem';
import { ReactComponent as GirlWithPencilChar } from '@assets/girl-with-pencil 1.svg';
import PrimaryButton from '@components/PrimaryButton';

function GameModeList() {
    const [selected, setSelected] = useState<number>(0);

    const modes = [
        {
            title: 'RANDOM KEYWORD',
            description: '무작위 단어로 시작해보세요!',
            illustration: <GirlWithPencilChar />,
        },
    ];

    return (
        <Card>
            <CardInner>
                {modes.map((mode, idx) => (
                    <GameModeItem mode={mode} key={mode.title} isSelected={selected === idx} />
                ))}
                <ButtonWrapper>
                    <PrimaryButton topText='START GAME' bottomText='시작하기' />
                </ButtonWrapper>
            </CardInner>
        </Card>
    );
}

export default GameModeList;

const CardInner = styled.div`
    padding: 20px 18px;
    height: 616px;
    display: flex;
    flex-direction: column;
`;

const ButtonWrapper = styled.div`
    margin: auto 0 0 auto;
`;
