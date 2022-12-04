import VideoCallUser from '@components/VideoCallUser';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { userStreamListState, WebRTCUser } from '@atoms/game';
import { userState, userStreamState } from '@atoms/user';
import { Center } from '@styles/styled';

function GameUsers() {
    const userStreamList = useRecoilValue(userStreamListState);
    const currentUser = useRecoilValue(userState);
    const selfStream = useRecoilValue(userStreamState);

    return (
        <Container>
            <VideoCallUser userName={currentUser.name} video={selfStream} />
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
