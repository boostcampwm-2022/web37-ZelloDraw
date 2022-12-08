import { ReactComponent as TimerIcon } from '@assets/icons/timer-icon.svg';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { roundInfoState } from '@atoms/game';
import { motion } from 'framer-motion';

function Timer() {
    const roundInfo = useRecoilValue(roundInfoState);

    return (
        <Container>
            <ProgressBar>
                <Bar />
                <Progress
                    initial={{ height: '100%' }}
                    animate={{ height: '0%' }}
                    transition={{ duration: roundInfo?.limitTime || 60 }}
                />
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

const Progress = styled(motion.div)`
    width: 100%;
    height: 100%;
    transform-origin: bottom;
    position: absolute;
    bottom: 0;
    left: 0;
    background: ${({ theme }) => theme.gradation.primaryLightBrown};
    border: 1px solid ${({ theme }) => theme.color.whiteT2};
    border-radius: 24px;
`;
