import React from 'react';
import styled from 'styled-components';

function MadeByText() {
    return (
        <TextBox>
            made by <Title>team ZELLO</Title>
        </TextBox>
    );
}

const TextBox = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: ${({ theme }) => theme.typo.h4};
    line-height: 31px;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.color.white};
    margin: 0 28px 24px auto;
`;

const Title = styled.text`
    font-family: Sniglet;
    font-weight: 800;
    line-height: 30px;
    letter-spacing: 0.01em;
    padding-left: 5px;
`;

export default MadeByText;
