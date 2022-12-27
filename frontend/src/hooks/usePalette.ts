import { useEffect, useState } from 'react';
import { PEN_DEFAULT_COLOR, ToolsType } from '@utils/constants';
import pen from '@assets/icons/pen-icon.svg';
import paint from '@assets/icons/paint-icon.svg';
import eraser from '@assets/icons/eraser-icon.svg';
import reset from '@assets/icons/reset-icon.svg';
import actPen from '@assets/icons/pen-icon-activated.svg';
import actPaint from '@assets/icons/paint-icon-activated.svg';
import actEraser from '@assets/icons/eraser-icon-activated.svg';
import actReset from '@assets/icons/reset-icon-activated.svg';
import selectedSound from '@assets/sounds/select-tools.wav';
import useSoundEffect from '@hooks/useSoundEffect';
import { colors } from '@styles/ZelloTheme';

interface ToolType {
    element: any;
    type: ToolsType;
    onclick: any;
}

interface PaletteType {
    onClickPen: (color: string) => void;
    onClickPaint: () => void;
    onColorChange: (color: string) => void;
    onClickEraser: () => void;
    onClickReset: () => void;
    onLineWidthChange: (index: number) => void;
}

function usePalette({
    onClickPen,
    onClickPaint,
    onColorChange,
    onClickEraser,
    onClickReset,
    onLineWidthChange,
}: PaletteType) {
    const [selectedColor, setSelectedColor] = useState<string>(colors.black);
    const [selectedTool, setSelectedTool] = useState<ToolsType>(ToolsType.PEN);
    const [selectedLineWidth, setSelectedLineWidth] = useState<number>(1);

    const { playSoundEffect } = useSoundEffect();

    useEffect(() => {
        // 도구 초기화
        onChangeTool(ToolsType.PEN);
        onClickColor({ color: PEN_DEFAULT_COLOR });
        onClickLineWidth(1);
        onClickPen(PEN_DEFAULT_COLOR);
    }, []);

    const isSelectedTool = (type: ToolsType) => selectedTool === type;

    const tools: ToolType[] = [
        {
            element: isSelectedTool(ToolsType.PEN) ? actPen : pen,
            type: ToolsType.PEN,
            onclick: onClickPen,
        },
        {
            element: isSelectedTool(ToolsType.PAINT) ? actPaint : paint,
            type: ToolsType.PAINT,
            onclick: onClickPaint,
        },
        {
            element: isSelectedTool(ToolsType.ERASER) ? actEraser : eraser,
            type: ToolsType.ERASER,
            onclick: onClickEraser,
        },
        {
            element: isSelectedTool(ToolsType.RESET) ? actReset : reset,
            type: ToolsType.RESET,
            onclick: onClickReset,
        },
    ];

    const onClickLineWidth = (index: number) => {
        setSelectedLineWidth(index);
        onLineWidthChange(index);
    };

    const onClickColor = ({
        color,
        isFromPicker = false,
    }: {
        color: string;
        isFromPicker?: boolean;
    }) => {
        if (!isFromPicker) playSoundEffect(selectedSound);
        setSelectedColor(color);
        if (selectedTool === ToolsType.ERASER) setSelectedTool(ToolsType.PEN);
        onColorChange(color);
    };

    const onChangeTool = (tool: ToolsType) => {
        setSelectedTool(tool);
        if (tool === ToolsType.RESET) {
            setTimeout(() => {
                setSelectedTool(ToolsType.PEN);
                onClickPen(selectedColor);
            }, 200);
        }

        playSoundEffect(selectedSound);
    };

    return {
        tools,
        selectedColor,
        selectedTool,
        selectedLineWidth,
        onClickColor,
        onChangeTool,
        onClickLineWidth,
    };
}

export default usePalette;
