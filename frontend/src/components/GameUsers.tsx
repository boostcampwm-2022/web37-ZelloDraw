import VideoCallUser from '@components/VideoCallUser';
import styled from 'styled-components';

function GameUsers() {
    const testUsers = [
        '젤로조아13579',
        '젤로조아23579',
        '젤로조아33579',
        '젤로조아43579',
        '젤로조아53579',
        '젤로조아63579',
        '젤로조아73579',
        '젤로조아83579',
    ];
    return (
        <Container>
            {testUsers.map((userName, index) => (
                <VideoCallUser userName={userName} key={`${userName} ${index}`} />
            ))}
        </Container>
    );
}

export default GameUsers;

const Container = styled.div`
    width: 100%;
    max-width: 1728px;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 8px;
    margin-bottom: 68px;
`;
