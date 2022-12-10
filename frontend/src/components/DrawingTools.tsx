import styled from 'styled-components';
import { Center, Color } from '@styles/styled';
import { colorName } from '@utils/constants';
import HexColorPicker from './HexColorPicker';
import { colors } from '@styles/ZelloTheme';
import usePalette from '@hooks/usePalette';

interface PaletteType {
    onClickPen: (color: string) => void;
    onClickPaint: () => void;
    onColorChange: (color: string) => void;
    onClickEraser: () => void;
    onClickReset: () => void;
    onLineWidthChange: (index: number) => void;
}

interface DrawingToolsType {
    restProps: PaletteType;
}

function DrawingTools({ restProps }: DrawingToolsType) {
    const {
        tools,
        selectedColor,
        selectedTool,
        selectedLineWidth,
        onClickColor,
        onChangeTool,
        onClickLineWidth,
    } = usePalette(restProps);

    return (
        <Container>
            <Tools>
                {tools.map((tool, index) => (
                    <Tool
                        key={index}
                        onClick={() => onChangeTool(tool.type)}
                        isSelected={selectedTool === tool.type}
                    >
                        <img src={tool.element} onClick={tool.onclick} />
                    </Tool>
                ))}
            </Tools>
            <LineWidthPicker>
                {[4, 8, 16, 32].map((value, index) => (
                    <LineWidth
                        key={value}
                        size={`${value}px`}
                        onClick={() => onClickLineWidth(index)}
                        isSelected={selectedLineWidth === index}
                    ></LineWidth>
                ))}
            </LineWidthPicker>
            <ColorPicker>
                {colorName.map((colorName, index) => (
                    <Color
                        type={'button'}
                        key={`${colorName} ${index}`}
                        colorName={colorName}
                        isSelected={colors[colorName] === selectedColor}
                        onClick={() => onClickColor(colors[colorName])}
                    />
                ))}
                <HexColorPicker onClickPickerColor={onClickColor} selected={selectedColor} />
            </ColorPicker>
        </Container>
    );
}

export default DrawingTools;

const Container = styled(Center)`
    flex-direction: column;
`;

const Tools = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 7px;
    margin-top: 25px;
`;

const Tool = styled.button<{ isSelected: boolean }>`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) =>
        props.isSelected ? props.theme.color.whiteT2 : props.theme.color.whiteT1};
    border-radius: 10px;
    border: ${(props) =>
        props.isSelected
            ? `2px solid ${String(props.theme.color.primaryDark)}`
            : `1px solid ${String(props.theme.color.brown)}`};
    box-shadow: ${({ theme }) => theme.shadow.btn};

    &:first-of-type {
        //펜 아이콘 위치 수정
        img {
            transform: translateY(2px);
        }
    }

    &:nth-of-type(2) {
        //페인트 아이콘 위치 수정
        img {
            transform: translateX(-1px);
        }
    }

    &:nth-of-type(3) {
        //지우개 아이콘 위치 수정
        img {
            transform: translate(3px, 4px);
        }
    }
`;

const LineWidthPicker = styled.div`
    width: 100%;
    height: 48px;
    background: ${({ theme }) => theme.color.whiteT1};
    border: 1px solid ${({ theme }) => theme.color.primaryLight};
    box-shadow: ${({ theme }) => theme.shadow.btn};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 16px 0px;
`;

const LineWidth = styled.div<{ size: string; isSelected: boolean }>`
    width: ${(props) => props.size};
    height: ${(props) => props.size};
    background: ${(props) =>
        props.isSelected ? props.theme.color.primaryDark : props.theme.color.white};
    box-shadow: ${(props) => props.theme.shadow.btn};
    border-radius: 50%;
    cursor: pointer;
    padding: 2px;
`;

const ColorPicker = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 32px);
    grid-template-rows: repeat(6, 32px);
    grid-column-gap: 24px;
    grid-row-gap: 12px;
`;
