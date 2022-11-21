import styled from 'styled-components';
import SketchbookCard from '@components/SketchbookCard';
import GameUsers from '@components/GameUsers';
import MicButton from '@components/MicButton';
import CameraButton from '@components/CameraButton';
import SmallLogo from '@assets/logo-s.png';
import useMovePage from '@hooks/useMovePage';
import SubmitWord from '@components/SubmitWord';

function Game() {
    const [setPage] = useMovePage();

    // TODO: 유저리스트 가져와서 GameUsers 컴포넌트 구성하기

    return (
        <Container>
            <GameUsers />
            <SketchbookSection>
                <SketchbookCard />
                <SubmitWord />
            </SketchbookSection>
            <CamAndMicWrapper>
                <CameraButton />
                <MicButton />
            </CamAndMicWrapper>
            <LogoWrapper onClick={() => setPage('/')}>
                <img src={SmallLogo} />
            </LogoWrapper>
            <div />
        </Container>
    );
}

export default Game;

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    position: relative;
    padding: 40px 36px;
`;

const SketchbookSection = styled.div`
    transform: translateY(-80px);
`;

const CamAndMicWrapper = styled.div`
    display: flex;
    position: absolute;
    bottom: 24px;
    left: 26px;

    > button {
        margin-right: 16px;
    }
`;

const LogoWrapper = styled.div`
    justify-self: center;
    position: absolute;
    bottom: 40px;
    cursor: pointer;
`;
