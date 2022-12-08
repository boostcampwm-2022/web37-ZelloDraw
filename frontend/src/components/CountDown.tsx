import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { countDownContainerVariants, countDownVariants } from '@utils/framerMotion';

function CountDown() {
    return (
        <Container
            variants={countDownContainerVariants}
            initial={'enter'}
            animate={'animate'}
            exit={'exit'}
            transition={{ type: 'spring', staggerChildren: 0.7 }}
        >
            <motion.div variants={countDownVariants}>3</motion.div>
            <motion.div variants={countDownVariants}>2</motion.div>
            <motion.div variants={countDownVariants}>1</motion.div>
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

    > div {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Sniglet', cursive;
        font-weight: 800;
        font-size: 200px;
    }

    > div:first-of-type {
        color: ${({ theme }) => theme.color.green};
    }

    > div:nth-of-type(2) {
        background-color: ${({ theme }) => theme.color.green};
        color: ${({ theme }) => theme.color.primary};
    }

    > div:nth-of-type(3) {
        background-color: ${({ theme }) => theme.color.primary};
        color: ${({ theme }) => theme.color.yellow};
    }
`;
