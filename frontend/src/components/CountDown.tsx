import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import {
    countDownBgVariants,
    countDownContainerVariants,
    countDownVariants,
} from '@utils/framerMotion';

function CountDown() {
    return (
        <Container
            variants={countDownContainerVariants}
            initial={'enter'}
            animate={'animate'}
            exit={'exit'}
            transition={{ type: 'spring', staggerChildren: 0.7 }}
        >
            <BackGround variants={countDownBgVariants}>
                <CountDownText variants={countDownVariants}>3</CountDownText>
            </BackGround>
            <BackGround variants={countDownBgVariants}>
                <CountDownText variants={countDownVariants}>2</CountDownText>
            </BackGround>
            <BackGround variants={countDownBgVariants}>
                <CountDownText variants={countDownVariants}>1</CountDownText>
            </BackGround>
        </Container>
    );
}

export default CountDown;

const Container = styled(motion(Center))`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: ${({ theme }) => theme.color.primary};
`;

const BackGround = styled(motion(Center))`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    &:first-of-type {
        color: ${({ theme }) => theme.color.green};
    }

    &:nth-of-type(2) {
        background-color: ${({ theme }) => theme.color.green};
        color: ${({ theme }) => theme.color.primary};
    }

    &:nth-of-type(3) {
        background-color: ${({ theme }) => theme.color.primary};
        color: ${({ theme }) => theme.color.yellow};
    }
`;

const CountDownText = styled(motion.div)`
    font-family: 'Sniglet', cursive;
    font-weight: 800;
    font-size: 200px;
`;
