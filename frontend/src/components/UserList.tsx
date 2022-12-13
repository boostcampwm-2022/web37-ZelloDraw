import styled from 'styled-components';
import Card from '@components/Card';
import InviteButton from '@components/InviteButton';
import EmptyVideoCall from '@components/EmptyVideoCall';
import VideoCallUser from '@components/VideoCallUser';
import { useRecoilValue } from 'recoil';
import { streamMapState, userListState, WebRTCUser } from '@atoms/game';
import { userCamState, userMicState, userState, userStreamState } from '@atoms/user';

function UserList() {
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);
    const userList = useRecoilValue(userListState);
    const currentUser = useRecoilValue(userState);
    const selfStream = useRecoilValue(userStreamState);
    const streamMap = useRecoilValue(streamMapState);

    return (
        <Card>
            <CardInner>
                <FlexBox>
                    <CountBox>
                        <PlayerCountText>{userList.length + 1}</PlayerCountText>
                        <PlayerCountSlash>/</PlayerCountSlash>
                        <PlayerCountText>8</PlayerCountText>
                    </CountBox>
                    <InviteButton />
                </FlexBox>
                <UserGridList>
                    <VideoCallUser
                        userName={currentUser.name}
                        stream={selfStream}
                        audio={userMic}
                        video={userCam}
                        isCurUser={true}
                    />
                    {userList.map((user: WebRTCUser, idx: number) => (
                        <VideoCallUser
                            key={user.userName}
                            userName={user.userName}
                            stream={streamMap.get(user.sid)}
                            audio={user.audio}
                            video={user.video}
                        />
                    ))}
                    {new Array(7 - userList.length)
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
    font-family: 'Sniglet', cursive;
    font-weight: 800;
    padding: 3px 2px 0;
`;

const UserGridList = styled.div`
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
`;
