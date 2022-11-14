import React from 'react';
import styled from 'styled-components';

function Card({ children }: { children: React.ReactNode }) {
    return <CardDiv>{children}</CardDiv>;
}

export default Card;

const CardDiv = styled.div`
    background: ${({ theme }) => theme.color.whiteT1};
    box-shadow: ${({ theme }) => theme.shadow.card};
    border: 1px solid ${({ theme }) => theme.color.brown};
    border-radius: 40px;
`;
