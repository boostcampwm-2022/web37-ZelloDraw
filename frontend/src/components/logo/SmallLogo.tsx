import React from 'react';
import styled from 'styled-components';

function SmallLogo() {
    return <Logo>ZELLO DRAW</Logo>;
}

export default SmallLogo;

const Logo = styled.div`
    width: 363px;
    font-family: 'Sniglet';
    font-style: normal;
    font-weight: 800;
    font-size: 60px;
    line-height: 75px;
    text-align: center;
    letter-spacing: -0.1em;
    background: ${({ theme }) => theme.gradation.whitePurple};
    text-shadow: ${({ theme }) => theme.shadow.card};

    -webkit-text-stroke: 1px ${({ theme }) => theme.color.yellow};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
`;
