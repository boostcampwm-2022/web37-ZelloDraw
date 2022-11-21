import styled from 'styled-components';
import { Center, Color } from '@styles/styled';
import { colorName } from '@utils/constants';
import HexColorPicker from './HexColorPicker';
import { colors } from '@styles/ZelloTheme';
import usePalette from '@hooks/usePalette';
import { useRecoilValue } from 'recoil';
import { roundDrawState } from '@atoms/game';

interface PaletteType {
    onClickPen: (color: string) => void;
    onColorChange: (color: string) => void;
    onClickEraser: () => void;
    onClickReset: () => void;
}

interface DrawingToolsType {
    rest: PaletteType;
}

function DrawingTools({ rest }: DrawingToolsType) {
    const { tools, selectedColor, selectedTool, onClickColor, onChangeTool } = usePalette(rest);
    const isDraw = useRecoilValue(roundDrawState);

    return (
        <Container isDraw={isDraw}>
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

const Container = styled(Center)<{ isDraw: boolean }>`
    flex-direction: column;
    opacity: ${({ isDraw }) => (isDraw ? 1 : 0)};
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
