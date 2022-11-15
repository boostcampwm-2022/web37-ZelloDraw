import React from 'react';
import styled from 'styled-components';

interface GameModeProps {
    title: string;
    description: string;
    illustration: React.ReactNode;
}

function GameModeItem({ mode, isSelected }: { mode: GameModeProps; isSelected: boolean }) {
    return (
        <GameModeCard isSelected={isSelected}>
            <FlexBox>
                <div style={{ paddingLeft: '31px' }}>
                    <GameTitle>{mode.title}</GameTitle>
                    <GameDescription>{mode.description}</GameDescription>
                </div>
                {mode.illustration}
            </FlexBox>
        </GameModeCard>
    );
}

export default GameModeItem;

const GameModeCard = styled.div<{ isSelected: boolean }>`
    width: 534px;
    padding-top: 18px;
    background: ${({ theme }) => theme.gradation.purplePrimary};
    border: 2px solid
        ${(props) => (props.isSelected ? props.theme.color.green : props.theme.color.white)};
    box-shadow: ${({ theme }) => theme.shadow.card};
    border-radius: 32px;
    cursor: pointer;
`;

const FlexBox = styled.div`
    display: flex;
    justify-content: space-between;
`;

const GameTitle = styled.h1`
    font-family: Sniglet;
    font-size: ${({ theme }) => theme.typo.h1};
    font-weight: 400;
    line-height: 49px;
    letter-spacing: 0.01em;
    text-align: left;
    color: ${({ theme }) => theme.color.white};
    width: 193px;
    margin-bottom: 8px;
    padding-top: 22px;
`;

const GameDescription = styled.h5`
    width: 245px;
    font-style: normal;
    font-weight: 400;
    font-size: ${({ theme }) => theme.typo.h5};
    line-height: 26px;
    letter-spacing: -0.045em;
    color: ${({ theme }) => theme.color.white};
`;
