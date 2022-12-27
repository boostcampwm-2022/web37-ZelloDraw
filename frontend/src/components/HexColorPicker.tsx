import { useState, useRef } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import useOnClickOutside from '@hooks/useOnClickOutside';
import { Color } from '@styles/styled';
import selectedSound from '@assets/sounds/select-tools.wav';
import useSoundEffect from '@hooks/useSoundEffect';

interface HexColorPickerProps {
    onClickPickerColor: ({
        color,
        isFromPicker,
    }: {
        color: string;
        isFromPicker?: boolean;
    }) => void;
    selected: string;
}

function HexColorPicker({ onClickPickerColor, selected }: HexColorPickerProps) {
    const [pickerColor, setPickerColor] = useState<string>('');
    const [modal, setModal] = useState<boolean>(false);
    const pickerRef = useRef(null);
    const { playSoundEffect } = useSoundEffect();

    useOnClickOutside(pickerRef, () => setModal(false));

    const openModal = (modalState: boolean) => {
        playSoundEffect(selectedSound);
        setModal(modalState);
    };
    const onChangeColor = (color: string) => {
        setPickerColor(color);
        onClickPickerColor({ color, isFromPicker: true });
    };

    return (
        <div ref={pickerRef}>
            <Color
                type={'button'}
                colorName={'rainbow'}
                isSelected={selected === pickerColor}
                onClick={() => openModal(!modal)}
                aria-label={'원하는 모든 색을 선택할 수 있는 기능'}
            />
            <ColorPickerWrapper>
                {modal && (
                    <ChromePicker
                        color={pickerColor}
                        onChange={(color) => onChangeColor(color.hex)}
                    />
                )}
            </ColorPickerWrapper>
        </div>
    );
}

export default HexColorPicker;

const ColorPickerWrapper = styled.div`
    position: relative;
    z-index: 100;
    margin-left: -100px;
`;
