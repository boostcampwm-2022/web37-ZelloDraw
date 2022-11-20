import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Center } from '@styles/styled';
import { useRecoilState } from 'recoil';
import { roundInfoState, roundInfoType } from '@atoms/game';
import { getRoundInfo } from '@game/NetworkServiceUtils';
import SketchbookCard from '@components/SketchbookCard';
import GameUsers from '@components/GameUsers';
import PrimaryButton from '@components/PrimaryButton';
import MicButton from '@components/MicButton';
import CameraButton from '@components/CameraButton';
import SmallLogo from '@assets/logo-s.png';
import useMovePage from '@hooks/useMovePage';

function Game() {
    const [setPage] = useMovePage();
    const [roundInfo, setRoundInfo] = useRecoilState<roundInfoType>(roundInfoState);
    const [drawState, setDrawState] = useState(false);

    // useEffect(() => {
    // TODO: useEffect 안에서는 동작하지 않는 이유는 무엇일까?
    getRoundInfo()
        .then((res) => setRoundInfo(res))
        .catch((err) => console.log(err));
    // });

    useEffect(() => {
        if (roundInfo === undefined) return;
        setDrawState(roundInfo.type === 'DRAW');
    }, [roundInfo]);

    return (
        <Container>
            <GameUsers />
            <SketchbookSection>
                <SketchbookCard drawState={drawState} />
                <SubmitSection>
                    {!drawState ? (
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
    cursor: pointer;
`;
