import React, { forwardRef, RefObject, useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '@components/Card';
import InviteButton from '@components/InviteButton';
import EmptyVideoCall from '@components/EmptyVideoCall';
import VideoCallUser from '@components/VideoCallUser';
import { useRecoilValue } from 'recoil';
import { userListState } from '@atoms/game';
import { userState } from '@atoms/user';

function UserList({ selfVideoRef }: { selfVideoRef: React.RefObject<HTMLVideoElement> }) {
    const userList = useRecoilValue(userListState);
    const currentUser = useRecoilValue(userState);

    return (
        <Card>
            <CardInner>
                <FlexBox>
                    <CountBox>
                        <PlayerCountText>{userList.length}</PlayerCountText>
                        <PlayerCountSlash>/</PlayerCountSlash>
                        <PlayerCountText>8</PlayerCountText>
                    </CountBox>
                    <InviteButton />
                </FlexBox>
                <UserGridList>
                    {userList.map((user: string, idx: number) =>
                        currentUser.name === user ? (
                            <VideoCallUser key={idx} userName={user} video={selfVideoRef} />
                        ) : (
                            <VideoCallUser key={idx} userName={user} />
                        ),
                    )}
                    {new Array(8 - userList.length)
                        .fill('empty')
                        .map((item: string, idx: number) => (
                            <EmptyVideoCall key={idx} />
                        ))}
                </UserGridList>
            </CardInner>
        </Card>
    );
}

export default UserList;

const CardInner = styled.div`
    padding: 20px 30px;
    width: 512px;
    height: 612px;
`;

const FlexBox = styled.div`
    display: flex;
    justify-content: space-between;
`;

const CountBox = styled.div`
    display: flex;
`;

const PlayerCountText = styled.h3`
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 160%;
    text-align: center;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.color.yellow};
    -webkit-text-stroke: 1px ${({ theme }) => theme.color.blackT1};
`;

const PlayerCountSlash = styled(PlayerCountText)`
    font-family: 'Sniglet';
    font-weight: 800;
    padding: 3px 2px 0;
`;

const UserGridList = styled.div`
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
`;
