import styled from 'styled-components';
import { Center } from '@styles/styled';

interface ControlButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    labelText: string;
}

function ControlButton({ children, onClick, disabled = false, labelText }: ControlButtonProps) {
    return (
        <ControlBtnContainer onClick={onClick} role={'button'}>
            <ControlBtn disabled={disabled}>{children}</ControlBtn>
            <ControlBtnLabel>{labelText}</ControlBtnLabel>
        </ControlBtnContainer>
    );
}

export default ControlButton;

export const ControlBtnContainer = styled(Center)`
    flex-direction: column;
    width: 84px;
`;

export const ControlBtn = styled.button`
    all: unset;
    cursor: pointer;
    width: 64px;

    img {
        width: 64px;
        height: 64px;
    }
`;

export const ControlBtnLabel = styled.div`
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.04em;
    color: ${({ theme }) => theme.color.whiteT2};
`;
