import { colors } from '@styles/ZelloTheme';
import { ReactComponent as PenIcon } from '@assets/icons/pen-icon.svg';
import { ReactComponent as PaintIcon } from '@assets/icons/paint-icon.svg';
import { ReactComponent as EraserIcon } from '@assets/icons/eraser-icon.svg';
import { ReactComponent as ResetIcon } from '@assets/icons/reset-icon.svg';
import styled from 'styled-components';
import { Center } from '@styles/styled';

function DrawingTools() {
    const colorName = [
        'brown',
        'green',
        'pink',
        'sky',
        'red',
        'primary',
        'yellow',
        'purple',
        'gray1',
        'black',
        'white',
        'rainbow',
    ];

    return (
        <Container>
            <Tools>
                <Tool>
                    <PenIcon />
                </Tool>
                <Tool>
                    <PaintIcon />
                </Tool>
                <Tool>
                    <EraserIcon />
                </Tool>
                <Tool>
                    <ResetIcon />
                </Tool>
            </Tools>
            <ColorPicker>
                {colorName.map((colorName, index) => (
                    <Color key={`${colorName} ${index}`} colorName={colorName} />
                ))}
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

const Color = styled.button<{ colorName: string }>`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${({ colorName }) => colors[colorName as keyof typeof colors]};
    box-shadow: ${({ theme }) => theme.shadow.btn};
`;
