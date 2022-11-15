import { ReactComponent as TimerIcon } from '@assets/icons/timer-icon.svg';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { useEffect, useState } from 'react';

function Timer() {
    const time = 60;
    const [intervalId, setIntervalId] = useState<any>(undefined);
    const [timeLeft, setTimeLeft] = useState<number>(time);
    const [progress, setProgress] = useState<number>(100);

    useEffect(() => {
        // todo: 라운드 시작 이벤트를 받을 경우 타이머가 시작되도록 수정
        if (timeLeft === time) {
            const startTimer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            setIntervalId(startTimer);
        } else if (timeLeft === 0) {
            // 시간이 0초가 되면 타이머가 멈춘다.
            // todo: 라운드 종료 이벤트 보내기
            clearInterval(intervalId);
            setIntervalId(undefined);
            console.log('time is up!');
        }

        // 프로그레스바의 높이를 설정
        setProgress((timeLeft / time) * 100);
    }, [timeLeft]);

    return (
        <Container>
            <ProgressBar>
                <Bar></Bar>
                <Progress progress={progress}></Progress>
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

const Progress = styled.div<{ progress: number }>`
    width: 100%;
    height: ${({ progress }) => progress}%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: ${({ theme }) => theme.gradation.primaryLightBrown};
    border: 1px solid ${({ theme }) => theme.color.whiteT2};
    border-radius: 24px;
    transition: height 1s linear;
`;
