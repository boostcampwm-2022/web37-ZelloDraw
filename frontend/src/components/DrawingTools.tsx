import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as PenIcon } from '@assets/icons/pen-icon.svg';
import { ReactComponent as PaintIcon } from '@assets/icons/paint-icon.svg';
import { ReactComponent as EraserIcon } from '@assets/icons/eraser-icon.svg';
import { ReactComponent as ResetIcon } from '@assets/icons/reset-icon.svg';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useRecoilState } from 'recoil';
import { colorState } from '@atoms/game';
import { colorName, ToolsType } from '@utils/constants';
import { colors } from '@styles/ZelloTheme';

function DrawingTools({ onDraw }: { onDraw: boolean }) {
    const [selectedColor, setSelectedColor] = useRecoilState<string>(colorState);
    const [isPicked, setIsPicked] = useState(false);

    const tools = [
        { element: <PenIcon />, type: ToolsType.PEN },
        { element: <PaintIcon />, type: ToolsType.PAINT },
        { element: <EraserIcon />, type: ToolsType.ERASER },
        { element: <ResetIcon />, type: ToolsType.RESET },
    ];

    const onClickColor = (colorName: string) => {
        setSelectedColor(colors[colorName]);
        setIsPicked(false);
    };

    const onChangeColorPicker = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        setSelectedColor(event.target.value);
        setIsPicked(true);
    };

    return (
        <Container onDraw={onDraw}>
            <Tools>
                {tools.map((tool, index) => (
                    <Tool key={index}>{tool.element}</Tool>
                ))}
            </Tools>
            <ColorPicker>
                {colorName.map((colorName, index) => (
                    <Color
                        type={'button'}
                        key={`${colorName} ${index}`}
                        colorName={colorName}
                        isSelected={colors[colorName] === selectedColor && !isPicked}
                        onClick={() => onClickColor(colorName)}
                    />
                ))}
                <ColorInput
                    type={'color'}
                    colorName={'rainbow'}
                    isSelected={isPicked}
                    onChange={onChangeColorPicker}
                    onClick={onChangeColorPicker}
                />
            </ColorPicker>
        </Container>
    );
}

export default DrawingTools;

const Container = styled(Center)<{ onDraw: boolean }>`
    flex-direction: column;
    opacity: ${({ onDraw }) => (onDraw ? 1 : 0)};
`;

const Tools = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 8px;
    margin-bottom: 44px;

    button {
        //펜 및 리셋 아이콘 위치 수정
        svg {
            transform: translateY(1px);
        }
    }
    button:nth-of-type(2) {
        //페인트 아이콘 위치 수정
        svg {
            transform: translate(-1px, -1px);
        }
    }

    button:nth-of-type(3) {
        //지우개 아이콘 위치 수정
        svg {
            transform: translate(3px, 3px);
        }
    }
`;

const Tool = styled.button`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.color.whiteT2};
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.color.brown};
    box-shadow: ${({ theme }) => theme.shadow.btn};
`;

const ColorPicker = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 32px);
    grid-template-rows: repeat(6, 32px);
    grid-column-gap: 24px;
    grid-row-gap: 12px;
`;

const Color = styled.input<{ colorName: string; isSelected: boolean }>`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${({ colorName }) => colors[colorName as keyof typeof colors]};
    box-shadow: ${({ theme }) => theme.shadow.btn};
    border: ${({ isSelected }) => (isSelected ? `3px solid rgba(246, 245, 248, 0.6)` : ``)};
    cursor: pointer;
`;

const ColorInput = styled(Color)`
    -webkit-appearance: none;
    appearance: none;
    padding: 0;
    border-radius: 50%;
    border: ${({ isSelected }) => (isSelected ? `3px solid rgba(246, 245, 248, 0.6)` : ``)};

    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    &::-moz-color-swatch-wrapper {
        padding: 0;
    }

    &::-webkit-color-swatch {
        appearance: none;
        border: none;
        border-radius: 50%;
        width: 0px;
    }

    &::-moz-color-swatch {
        border: none;
        border-radius: 50%;
        width: 20px;
    }
`;

const HexColorWrapper = styled.div`
    position: absolute;
    margin-top: 260px;
`;
