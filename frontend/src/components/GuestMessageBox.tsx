import React from 'react';
import styled from 'styled-components';

function GuestMessageBox() {
    return (
        <BoxContainer>
            <ColoredText>초대를 받았군요! 준비가 되었다면 </ColoredText>
            <PrimaryText>입장하기</PrimaryText>
            <ColoredText>를 눌러주세요.</ColoredText>
        </BoxContainer>
    );
}

export default GuestMessageBox;

const BoxContainer = styled.div`
    background: ${({ theme }) => theme.color.blackT1};
    border: 1px solid ${({ theme }) => theme.color.white};
    box-shadow: ${({ theme }) => theme.shadow.card};
    border-radius: 20px;
    padding: 6px 13px;
`;

const StyledSpan = styled.span`
    font-style: normal;
    font-size: ${({ theme }) => theme.typo.h4};
    line-height: 31px;
    letter-spacing: -0.05em;
`;

const ColoredText = styled(StyledSpan)`
    font-weight: 600;
    color: ${({ theme }) => theme.color.primaryLight};
`;

const PrimaryText = styled(StyledSpan)`
    font-weight: 400;
    color: ${({ theme }) => theme.color.white};
`;
