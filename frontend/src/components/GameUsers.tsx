import VideoCallUser from '@components/VideoCallUser';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { userListState } from '@atoms/game';
import { Center } from '@styles/styled';

function GameUsers() {
    const userList = useRecoilValue(userListState);

    return (
        <Container>
            {userList.map((user: string, idx: number) => (
                <VideoCallUser key={`${user} ${idx}`} userName={user} />
            ))}
        </Container>
    );
}

export default GameUsers;

const Container = styled(Center)`
    width: 100%;
    max-width: 1820px;
    grid-gap: 8px;
    margin-bottom: 48px;
`;
