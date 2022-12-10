import { ReactNode } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { slideVariants } from '@utils/framerMotion';
import { useRecoilValue } from 'recoil';
import { bookDirectionState, currentBookIdxState } from '@atoms/result';
import SketchbookImg from '@assets/sketchbook.svg';
import Card from '@components/Card';

interface SketchbookCardType {
    left?: ReactNode;
    center: ReactNode;
    right?: ReactNode;
}

function SketchbookCard({ left, center, right }: SketchbookCardType) {
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const bookDirection = useRecoilValue(bookDirectionState);
    const xValue = 600;

    return (
        <Card>
            <Container>
                <LeftSide>{left}</LeftSide>
                <SketchbookWrapper>
                    <AnimatePresence initial={false} custom={{ direction: bookDirection, xValue }}>
                        <motion.div
                            key={currentBookIdx}
                            custom={{ direction: bookDirection, xValue }}
                            variants={slideVariants}
                            initial='enter'
                            animate='center'
                            exit='exit'
                            transition={{
                                x: { type: 'spring', damping: 30, stiffness: 300 },
                                opacity: { duration: 0.2 },
                            }}
                        >
                            <img src={SketchbookImg} alt={'sketchbook'} />
                            {center}
                        </motion.div>
                    </AnimatePresence>
                </SketchbookWrapper>
                <RightSide>{right}</RightSide>
            </Container>
        </Card>
    );
}
export default SketchbookCard;

const Container = styled(Center)`
    padding: 44px 38px 0 28px;
`;

const LeftSide = styled.div`
    display: flex;
    align-items: end;
    width: 108px;
    height: 100%;
`;

const SketchbookWrapper = styled.div`
    position: relative;
    width: 786px;
    height: 560px;
    margin: 0 30px;
    > div {
        position: absolute;
    }
`;

const RightSide = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100px;
    height: 500px;
`;
