import styled from 'styled-components';
import { ScaledSection } from '@styles/styled';
import SketchbookCard from '@components/SketchbookCard';
import GameUsers from '@components/GameUsers';
import MicButton from '@components/MicButton';
import CameraButton from '@components/CameraButton';
import SmallLogo from '@assets/logo-s.png';
import useMovePage from '@hooks/useMovePage';
import QuizReplySection from '@components/QuizReplySection';

function Game() {
    const [setPage] = useMovePage();

    return (
        <Container>
            <GameUsers />
            <SketchbookSection>
                <SketchbookCard />
                <QuizReplySection />
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

const Container = styled(ScaledSection)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    position: relative;
    padding: 40px 36px;
`;

const SketchbookSection = styled.div`
    margin-bottom: 120px;
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
