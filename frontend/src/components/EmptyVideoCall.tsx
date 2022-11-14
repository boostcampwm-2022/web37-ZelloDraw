import React from 'react';
import styled from 'styled-components';

function EmptyVideoCall() {
    return (
        <Container>
            <h3>EMPTY</h3>비어있음
        </Container>
    );
}

export default EmptyVideoCall;

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 220px;
    height: 123.2px;
    text-align: center;
    background: ${({ theme }) => theme.color.purple};
    border: 1px solid ${({ theme }) => theme.color.blackT1};
    border-radius: 24px;

    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.color.whiteT2};

    h3 {
        font-weight: 600;
    }
`;
