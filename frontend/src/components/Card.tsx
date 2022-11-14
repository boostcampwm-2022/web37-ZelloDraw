import React from 'react';
import styled from 'styled-components';

function Card({ children }: { children: React.ReactNode }) {
    return <CardDiv>{children}</CardDiv>;
}

export default Card;

const CardDiv = styled.div`
    background: ${({ theme }) => theme.color.whiteT1};
    box-shadow: ${({ theme }) => theme.shadow.card};
    border-radius: 40px;
    padding: 1px;
    border: 1px solid solid;
    background: ${({ theme }) => theme.color.primaryLightBrown};
    background-image: linear-gradient(#fff, #fff),
        ${({ theme }) => theme.gradation.primaryLightBrown};
    background-origin: border-box;
    background-clip: content-box, border-box;
`;
