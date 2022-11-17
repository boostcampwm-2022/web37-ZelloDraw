import React, { useState } from 'react';
import { ReactComponent as PenIcon } from '@assets/icons/pen-icon.svg';
import { ReactComponent as PaintIcon } from '@assets/icons/paint-icon.svg';
import { ReactComponent as EraserIcon } from '@assets/icons/eraser-icon.svg';
import { ReactComponent as ResetIcon } from '@assets/icons/reset-icon.svg';
import { ReactComponent as ActivedPenIcon } from '@assets/icons/pen-icon-actived.svg';
import { ReactComponent as ActivedPaintIcon } from '@assets/icons/paint-icon-actived.svg';
import { ReactComponent as ActivedEraserIcon } from '@assets/icons/eraser-icon-actived.svg';
import { ReactComponent as ActivedResetIcon } from '@assets/icons/reset-icon-actived.svg';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import {
    colorName,
    ERASER_COLOR,
    ERASER_LINE_WIDTH,
    PEN_LINE_WIDTH,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    ToolsType,
} from '@utils/constants';
import { colors } from '@styles/ZelloTheme';

interface DrawingToolsType {
    drawState: boolean;
    ctxRef: any;
}

function DrawingTools({ drawState, ctxRef }: DrawingToolsType) {
    const [selectedColor, setSelectedColor] = useState<string>(colors.black);
    const [isPicked, setIsPicked] = useState(false);
    const [selectedTool, setSelectedTool] = useState(ToolsType.PEN);

    // TODO: 추후 분리예정
    const onClickPen = () => {
        ctxRef.current.strokeStyle = selectedColor;
        ctxRef.current.lineWidth = PEN_LINE_WIDTH;
    };

    const onColorChange = (color: string) => {
        ctxRef.current.strokeStyle = color;
        ctxRef.current.fillStyle = color;
        ctxRef.current.lineWidth = PEN_LINE_WIDTH;
    };

    const onClickEraser = () => {
        ctxRef.current.strokeStyle = ERASER_COLOR;
        ctxRef.current.lineWidth = ERASER_LINE_WIDTH;
    };

    const onClickReset = () => {
        ctxRef.current.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    const tools = [
        {
            element:
                selectedTool === ToolsType.PEN ? (
                    <ActivedPenIcon />
                ) : (
                    <PenIcon onClick={onClickPen} />
                ),
            type: ToolsType.PEN,
        },
        {
            element:
                selectedTool === ToolsType.PAINT ? (
                    <ActivedPaintIcon />
                ) : (
                    <PaintIcon onClick={onClickPen} />
                ),
            type: ToolsType.PAINT,
        },
        {
            element:
                selectedTool === ToolsType.ERASER ? (
                    <ActivedEraserIcon />
                ) : (
                    <EraserIcon onClick={onClickEraser} />
                ),
            type: ToolsType.ERASER,
        },
        {
            element:
                selectedTool === ToolsType.RESET ? (
                    <ActivedResetIcon />
                ) : (
                    <ResetIcon onClick={onClickReset} />
                ),
            type: ToolsType.RESET,
        },
    ];

    const onClickColor = (colorName: string) => {
        setSelectedColor(colors[colorName]);
        setSelectedTool(ToolsType.PEN);
        setIsPicked(false);
        onColorChange(colors[colorName]);
    };

    const onChangeColorPicker = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        setSelectedColor(event.target.value);
        setSelectedTool(ToolsType.PEN);
        setIsPicked(true);
        onColorChange(event.target.value);
    };

    const onChangeTool = (tool: ToolsType) => {
        setSelectedTool(tool);
        if (tool === ToolsType.RESET) {
            setTimeout(() => {
                setSelectedTool(ToolsType.PEN);
            }, 200);
        }
    };

    return (
        <Container drawState={drawState}>
            <Tools>
                {tools.map((tool, index) => (
                    <Tool
                        key={index}
                        onClick={() => onChangeTool(tool.type)}
                        isSelected={selectedTool === tool.type}
                    >
                        {tool.element}
                    </Tool>
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

const Container = styled(Center)<{ drawState: boolean }>`
    flex-direction: column;
    opacity: ${({ drawState }) => (drawState ? 1 : 0)};
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

const Tool = styled.button<{ isSelected: boolean }>`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.color.whiteT2};
    border-radius: 10px;
    border: 1px solid
        ${(props) => (props.isSelected ? props.theme.color.primaryDark : props.theme.color.brown)};
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
