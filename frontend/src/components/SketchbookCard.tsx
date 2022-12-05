import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { currentBookIdxState } from '@atoms/result';
import { CANVAS_WIDTH } from '@utils/constants';
import SketchbookImg from '@assets/sketchbook.svg';
import Card from '@components/Card';

interface SketchbookCardType {
    left?: ReactNode;
    center: ReactNode;
    right?: ReactNode;
}

const slideVariants = {
    enter: ({ direction, xValue }: { direction: number; xValue: number }) => {
        return {
            x: direction * xValue,
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: ({ direction, xValue }: { direction: number; xValue: number }) => {
        return {
            zIndex: 0,
            x: direction * xValue * -1,
            opacity: 0,
        };
    },
};

function SketchbookCard({ left, center, right }: SketchbookCardType) {
    const currentBookIdx = useRecoilValue(currentBookIdxState);
    const [lastBookIdx, setLastBookIdx] = useState(0);
    const [direction, setDirection] = useState(1);
    const xValue = 600;

    useEffect(() => {
        if (currentBookIdx > lastBookIdx) {
            setDirection(1);
        } else {
            setDirection(-1);
        }
        setLastBookIdx(currentBookIdx);
    }, [currentBookIdx]);

    return (
        <Card>
            <Container>
                <LeftSide>{left}</LeftSide>
                <SketchbookWrapper>
                    <AnimatePresence initial={false} custom={{ direction, xValue }}>
                        <motion.div
                            key={currentBookIdx}
                            custom={{ direction, xValue }}
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
`;

const SketchbookWrapper = styled.div`
    position: relative;
    width: ${CANVAS_WIDTH}px;
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
