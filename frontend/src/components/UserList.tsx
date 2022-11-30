import React, { useEffect } from 'react';
import styled from 'styled-components';
import Card from '@components/Card';
import InviteButton from '@components/InviteButton';
import EmptyVideoCall from '@components/EmptyVideoCall';
import VideoCallUser from '@components/VideoCallUser';
import { useRecoilValue } from 'recoil';
import { userListState } from '@atoms/game';
import { userState } from '@atoms/user';
import { WebRTCUser } from '@hooks/useWebRTC';

interface UserListType {
    selfVideoRef: React.RefObject<HTMLVideoElement>;
    userStreamList: WebRTCUser[];
}

function UserList({ selfVideoRef, userStreamList }: UserListType) {
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
                    <VideoCallUser userName={currentUser.name} curUserRef={selfVideoRef} />
                    {userStreamList.map((user: WebRTCUser, idx: number) => (
                        <VideoCallUser key={idx} userName={user.sid} video={user.stream} />
                    ))}
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
