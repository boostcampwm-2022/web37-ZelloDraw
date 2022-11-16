import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Center } from '@styles/styled';
import SketchbookCard from '@components/SketchbookCard';
import GameUsers from '@components/GameUsers';
import PrimaryButton from '@components/PrimaryButton';
import MicButton from '@components/MicButton';
import CameraButton from '@components/CameraButton';
import SmallLogo from '@assets/logo-s.png';
import { emitStartGameToSocket } from '@game/socketio';

function Game() {
    const [onDraw, setOnDraw] = useState(true);

    // todo: 소켓 이벤트 start-game emit, useEffect
    // 서버에서 다시 reemit 한 값을 받아서 제시어 콘솔에 찍어보기 => 스케치북 카드
    // 소켓 부분을 socketio.ts로 빼서 import 해서 사용하기
    useEffect(() => {
        console.log('emit start game');
        emitStartGameToSocket();
    }, []);

    return (
        <Container>
            <GameUsers />
            <SketchbookSection>
                <SketchbookCard onDraw={onDraw} />
                <SubmitSection>
                    {!onDraw ? (
                        <AnswerInput placeholder={'그림을 보고 답을 맞춰보세요!'} />
                    ) : (
                        <div />
                    )}
                    <PrimaryButton topText={'SUBMIT'} bottomText={'제출하기'} />
                </SubmitSection>
            </SketchbookSection>
            <CamAndMicWrapper>
                <CameraButton />
                <MicButton />
            </CamAndMicWrapper>
            <LogoWrapper>
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

const SubmitSection = styled(Center)`
    width: 1120px;
    margin-top: 26px;

    > div {
        width: 100%;
    }
`;

const AnswerInput = styled.input`
    flex-grow: 1;
    height: 48px;
    padding: 4px 20px;
    margin-right: 16px;
    background-color: ${({ theme }) => theme.color.blackT1};
    color: ${({ theme }) => theme.color.green};
    border: 1px solid ${({ theme }) => theme.color.yellow};
    border-radius: 20px;
    font-size: ${({ theme }) => theme.typo.h4};
    font-weight: 800;

    &::placeholder {
        color: ${({ theme }) => theme.color.gray1};
        font-weight: 500;
    }

    &:focus {
        border-color: ${({ theme }) => theme.color.green};
    }
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
`;
