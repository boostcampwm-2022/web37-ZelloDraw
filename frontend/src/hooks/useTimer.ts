import { useEffect, useState } from 'react';

function useTimer({ interval, clearTimerDeps }: { interval: number; clearTimerDeps: number }) {
    const [intervalId, setIntervalId] = useState<any>(undefined);
    const [limitTime, setLimitTime] = useState(60);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimeOver, setIsTimeOver] = useState(false);

    function setTimerTime(timerTime: number) {
        setLimitTime(timerTime);
        setTimeLeft(timerTime);
    }

    useEffect(() => {
        // 라운드나 스케치북이 새로 시작하면 이전에 사용하던 타이머와 중복 작동하지 않도록 초기화
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(undefined);
        }
    }, [clearTimerDeps]);

    useEffect(() => {
        if (limitTime === timeLeft) {
            setIsTimeOver(false);
            const startTimer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, interval);
            setIntervalId(startTimer);
        } else if (timeLeft < 0) {
            clearInterval(intervalId);
            setIntervalId(undefined);
            setIsTimeOver(true);
        }
    }, [timeLeft, clearTimerDeps]);

    return { limitTime, timeLeft, isTimeOver, setTimerTime };
}

export default useTimer;
