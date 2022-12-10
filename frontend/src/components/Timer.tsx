import { ReactComponent as TimerIcon } from '@assets/icons/timer-icon.svg';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { roundLimitTimeState, roundNumberState } from '@atoms/game';
import { motion } from 'framer-motion';

function Timer() {
    const { curRound } = useRecoilValue(roundNumberState);
    const limitTime = useRecoilValue(roundLimitTimeState);

    return (
        <Container>
            <ProgressBar>
                <Bar />
                <Progress key={curRound}>
                    <motion.div
                        initial={{ y: 1 }}
                        animate={{ y: 437 }}
                        transition={{ duration: limitTime }}
                    />
                    <motion.div
                        initial={{ scaleY: 1 }}
                        animate={{ scaleY: 0 }}
                        transition={{ duration: limitTime }}
                    ></motion.div>
                    <div />
                </Progress>
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
    border-radius: 999px;
`;

const Progress = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 24px;

    div {
        width: 100%;
        border: 1px solid ${({ theme }) => theme.color.whiteT2};
    }

    div:first-of-type,
    div:last-of-type {
        height: 6px;
    }

    div:nth-of-type(2) {
        height: calc(100% - 12px);
        background: ${({ theme }) => theme.gradation.primaryLightBrown};
        transform-origin: bottom;
        border-top: none;
        border-bottom: none;
    }

    div:first-of-type {
        background: ${({ theme }) => theme.color.primaryLight};
        border-radius: 24px 24px 0 0;
        border-bottom: none;
    }

    div:last-of-type {
        background: ${({ theme }) => theme.color.brown};
        border-radius: 0 0 24px 24px;
        transform: translateY(-1px);
        border-top: none;
    }
`;
