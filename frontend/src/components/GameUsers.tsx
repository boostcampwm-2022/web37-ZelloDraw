import VideoCallUser from '@components/VideoCallUser';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { userListState } from '@atoms/game';
import { Center } from '@styles/styled';
import { JoinLobbyReEmitRequest } from '@backend/core/user.dto';

function GameUsers() {
    const userList = useRecoilValue(userListState);

    return (
        <Container>
            {userList.map((user: JoinLobbyReEmitRequest, idx: number) => (
                <VideoCallUser key={`${user.userName} ${idx}`} userName={user.userName} />
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
