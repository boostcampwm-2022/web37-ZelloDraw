import VideoCallUser from '@components/VideoCallUser';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { userListState, WebRTCUser } from '@atoms/game';
import { userState, userStreamState, userMicState, userCamState } from '@atoms/user';
import { Center } from '@styles/styled';

function GameUsers() {
    const userCam = useRecoilValue(userCamState);
    const userMic = useRecoilValue(userMicState);
    const userList = useRecoilValue(userListState);
    const currentUser = useRecoilValue(userState);
    const selfStream = useRecoilValue(userStreamState);

    return (
        <Container>
            <VideoCallUser
                userName={currentUser.name}
                stream={selfStream}
                audio={userMic}
                video={userCam}
            />
            {userList.map((user: WebRTCUser, idx: number) => (
                <VideoCallUser
                    key={idx}
                    userName={user.userName}
                    stream={user.stream}
                    audio={user.audio}
                    video={user.video}
                />
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
