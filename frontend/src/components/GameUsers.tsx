import VideoCallUser from '@components/VideoCallUser';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { userListState, userStreamListState, WebRTCUser } from '@atoms/game';
import { userState } from '@atoms/user';
import { Center } from '@styles/styled';
import useWebRTC from '@hooks/useWebRTC';

function GameUsers() {
    const userList = useRecoilValue(userListState);
    const userStreamList = useRecoilValue(userStreamListState);
    const currentUser = useRecoilValue(userState);
    const { selfVideoRef } = useWebRTC();

    return (
        <Container>
            <VideoCallUser userName={currentUser.name} curUserRef={selfVideoRef} />
            {userStreamList.map((user: WebRTCUser, idx: number) => (
                <VideoCallUser key={idx} userName={user.userName} video={user.stream} />
            ))}
        </Container>
    );
}

export default GameUsers;

const Container = styled(Center)`
    width: 100%;
    max-width: 1820px;
    grid-gap: 8px;
    margin-bottom: 40px;
`;
