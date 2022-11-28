import { ReactComponent as TimerIcon } from '@assets/icons/timer-icon.svg';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { roundInfoState } from '@atoms/game';

function Timer() {
    const [intervalId, setIntervalId] = useState<any>(undefined);
    const [progress, setProgress] = useState<number>(100);
    const roundInfo = useRecoilValue(roundInfoState);
    const [limitTime, setLimitTime] = useState<number>(60);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [isTimeOver, setIsTimeOver] = useState<boolean>(false);

    useEffect(() => {
        if (roundInfo === undefined) return;
        setLimitTime(roundInfo.limitTime);
        setTimeLeft(roundInfo.limitTime);
    }, [roundInfo]);

    useEffect(() => {
        if (limitTime === timeLeft) {
            const startTimer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            setIntervalId(startTimer);
        } else if (timeLeft < 0) {
            // 시간이 0초가 되면 타이머가 멈춘다.
            clearInterval(intervalId);
            setIntervalId(undefined);
            setIsTimeOver(true);
        }

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
