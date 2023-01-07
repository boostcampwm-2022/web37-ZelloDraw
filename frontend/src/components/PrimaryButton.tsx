import styled from 'styled-components';

interface PrimaryButtonProps {
    topText: string;
    bottomText: string;
    allowed?: boolean;
}

function PrimaryButton({ topText, bottomText, allowed }: PrimaryButtonProps) {
    return (
        <PrimaryBtn
            isSubmitBtn={topText === 'SUBMIT'}
            isEditBtn={topText === 'EDIT'}
            allowed={allowed ?? true}
        >
            {topText}
            <div>{bottomText}</div>
        </PrimaryBtn>
    );
}

export default PrimaryButton;

const PrimaryBtn = styled.button<{
    isSubmitBtn: boolean;
    isEditBtn: boolean;
    allowed: boolean | undefined;
}>`
    all: unset;
    cursor: ${(props) => (props.allowed ? 'pointer' : 'not-allowed')};
    background: ${(props) =>
        props.isSubmitBtn
            ? props.theme.gradation.yellowGreen
            : props.isEditBtn
            ? props.theme.color.black
            : props.theme.gradation.yellowPurple};
    border: 1px solid ${({ theme }) => theme.color.whiteT2};
    border-radius: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 180px;
    padding: 8px;
    white-space: pre-line;

    font-style: normal;
    font-weight: 600;
    font-size: ${({ theme }) => theme.typo.h5};
    line-height: 26px;
    text-align: center;
    letter-spacing: -0.05em;
    color: ${(props) => (props.isEditBtn ? props.theme.color.gray1 : props.theme.color.white)};

    > div:last-of-type {
        font-weight: 400;
        letter-spacing: -0.045em;
        margin-top: -5px;
    }
`;
