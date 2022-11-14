import React from 'react';
import styled from 'styled-components';

function MainLogo() {
    return <Logo>ZELLO DRAW</Logo>;
}

export default MainLogo;

const Logo = styled.div`
    width: 554px;
    font-family: 'Sniglet';
    font-style: normal;
    font-weight: 800;
    font-size: 90px;
    line-height: 112px;
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
