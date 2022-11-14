import { ReactComponent as TimerIcon } from '@assets/icons/timer-icon.svg';
import styled from 'styled-components';
import { Center } from '@styles/styled';

function Timer() {
    return (
        <Container>
            <ProgressBar>
                <Bar></Bar>
                <Progress></Progress>
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

const Progress = styled.div`
    width: 100%;
    height: 80%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: ${({ theme }) => theme.gradation.primaryLightBrown};
    border: 1px solid ${({ theme }) => theme.color.whiteT2};
    border-radius: 24px;
`;
