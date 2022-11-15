import React from 'react';
import styled from 'styled-components';

function InviteButton() {
    const params = new URLSearchParams(location.search);

    const onClickInviteBtn = () => {
        console.log(params.get('id'));
    };
    return (
        <InviteBtn onClick={onClickInviteBtn}>
            INVITE<h3>초대하기</h3>
        </InviteBtn>
    );
}

export default InviteButton;

const InviteBtn = styled.button`
    all: unset;
    cursor: pointer;
    background: ${({ theme }) => theme.color.blackT1};
    border: 1px solid ${({ theme }) => theme.color.white};
    border-radius: 16px;
    width: 106px;
    height: 44px;

    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 21px;
    text-align: center;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.color.yellow};

    h3 {
        margin-top: -2px;
        font-weight: 400;
    }
`;
