import { useState, useRef } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import useOnClickOutside from '@hooks/useOnClickOutside';
import { Color } from '@styles/styled';

interface HexColorPickerProps {
    onClickPickerColor: (color: string) => void;
    selected: string;
}

function HexColorPicker({ onClickPickerColor, selected }: HexColorPickerProps) {
    const [pickerColor, setPickerColor] = useState<string>('');
    const [modal, setModal] = useState<boolean>(false);
    const pickerRef = useRef(null);

    useOnClickOutside(pickerRef, () => setModal(false));

    const onChangeColor = (color: string) => {
        setPickerColor(color);
        onClickPickerColor(color);
    };

    return (
        <div ref={pickerRef}>
            <Color
                type={'button'}
                colorName={'rainbow'}
                isSelected={selected === pickerColor}
                onClick={() => setModal(!modal)}
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
