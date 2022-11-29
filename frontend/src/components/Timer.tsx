import { ReactComponent as TimerIcon } from '@assets/icons/timer-icon.svg';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { roundInfoState } from '@atoms/game';
import useTimer from '@hooks/useTimer';

function Timer() {
    const [progress, setProgress] = useState<number>(100);
    const roundInfo = useRecoilValue(roundInfoState);
    const { limitTime, timeLeft, isTimeOver, setTimerTime } = useTimer(1000);

    useEffect(() => {
        if (roundInfo === undefined) return;
        setTimerTime(roundInfo.limitTime);
    }, [roundInfo]);

    useEffect(() => {
        // 프로그레스바의 높이를 설정
        setProgress((timeLeft / limitTime) * 100);
    }, [timeLeft]);

    return (
        <Container>
            <ProgressBar>
                <Bar></Bar>
                <Progress progress={progress} isTimeOver={isTimeOver}></Progress>
            </ProgressBar>
            <TimerIcon />
        </Container>
    );
}

export default Timer;

const Container = styled(Center)`
    flex-direction: column;
    margin-left: 32px;
`;

const ProgressBar = styled.div`
    width: 12px;
    height: 448px;
    position: relative;
    margin-bottom: 16px;
`;

const Bar = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.color.blackT1};
    border: 1px solid ${({ theme }) => theme.color.primaryLight};
    border-radius: 24px;
`;

const Progress = styled.div<{ progress: number; isTimeOver: boolean }>`
    width: 100%;
    height: ${({ progress }) => progress}%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: ${({ theme }) => theme.gradation.primaryLightBrown};
    border: 1px solid ${({ theme }) => theme.color.whiteT2};
    border-radius: 24px;
    opacity: ${({ isTimeOver }) => (isTimeOver ? 0 : 1)};
    transition: height 1s linear;
`;
