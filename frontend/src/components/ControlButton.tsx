import styled from 'styled-components';

interface ControlButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    labelText: string;
}

function ControlButton({ children, onClick, disabled = false, labelText }: ControlButtonProps) {
    return (
        <ControlBtnContainer onClick={onClick} disabled={disabled}>
            <ControlBtnImgWrapper>{children}</ControlBtnImgWrapper>
            <ControlBtnLabel>{labelText}</ControlBtnLabel>
        </ControlBtnContainer>
    );
}

export default ControlButton;

export const ControlBtnContainer = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 84px;
`;

export const ControlBtnImgWrapper = styled.div`
    all: unset;

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
