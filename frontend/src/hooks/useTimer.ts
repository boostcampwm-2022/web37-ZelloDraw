import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { roundNumberState } from '@atoms/game';

function useTimer(interval: number) {
    const [intervalId, setIntervalId] = useState<any>(undefined);
    const [limitTime, setLimitTime] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimeOver, setIsTimeOver] = useState(false);
    const { curRound } = useRecoilValue(roundNumberState);

    function setTimerTime(timerTime: number) {
        setLimitTime(timerTime);
        setTimeLeft(timerTime);
    }

    useEffect(() => {
        // 라운드가 새로 시작하면 이전에 사용하던 타이머와 중복 작동하지 않도록 초기화
        if (intervalId) clearInterval(intervalId);
    }, [curRound]);

    useEffect(() => {
        if (limitTime === timeLeft) {
            const startTimer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, interval);
            setIntervalId(startTimer);
        } else if (timeLeft < 0) {
            // 시간이 0초가 되면 타이머가 멈춘다.
            clearInterval(intervalId);
            setIntervalId(undefined);
            setIsTimeOver(true);
        }
    }, [timeLeft]);

    return { limitTime, timeLeft, isTimeOver, setTimerTime };
}

export default useTimer;
