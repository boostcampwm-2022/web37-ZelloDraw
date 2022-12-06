import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/chevron-left-icon.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/chevron-right-icon.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { slideVariants } from '@utils/framerMotion';

function InfoCarousel() {
    const [current, setCurrent] = useState<number>(0);
    const [direction, setDirection] = useState(1);
    const carouselSize = useRef(4);
    const xValue = 439;

    const contents: React.ReactNode[] = [
        <>
            <h3>즐거운 시간 보낼 준비가 되었나요?</h3>
            <h3>처음이라면 옆으로 넘겨</h3>
            <h3>도움말을 읽어보세요.</h3>
        </>,
        <>
            <h3>게임이 시작되면 각 플레이어는</h3>
            <h3>랜덤 제시어를 확인할 수 있어요.</h3>
        </>,
        <>
            <h3>다른 사람의 제시어를 확인하고</h3>
            <h3>제시어를 잘 묘사할 수 있는</h3>
            <h3>독특한 그림을 그려보아요!</h3>
        </>,
        <>
            <h3>다른 사람의 그림을 보고</h3>
            <h3>답을 유추해보기도 해요!</h3>
        </>,
    ];

    const moveSlide = (i: number) => {
        let nextIndex = current + i;
        if (nextIndex < 0) nextIndex = carouselSize.current - 1;
        else if (nextIndex >= carouselSize.current) nextIndex = 0;

        setDirection(i * -1);
        setCurrent(nextIndex);
    };

    return (
        <CarouselContainer>
            <Slide>
                <LeftArrowIcon className={'arrowIcon'} onClick={() => moveSlide(-1)} />
                <Window>
                    <AnimatePresence initial={false} custom={{ direction, xValue }}>
                        <SlideInner
                            key={current}
                            custom={{ direction, xValue }}
                            variants={slideVariants}
                            initial='enter'
                            animate='center'
                            exit='exit'
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {contents[current]}
                        </SlideInner>
                    </AnimatePresence>
                </Window>
                <RightArrowIcon className={'arrowIcon'} onClick={() => moveSlide(1)} />
            </Slide>
            <DotButtonSet>
                {contents.map((x, i) => (
                    <Dot key={i} isCurrent={i === current}></Dot>
                ))}
            </DotButtonSet>
        </CarouselContainer>
    );
}

export default InfoCarousel;

const CarouselContainer = styled.div`
    display: flex;
    flex-direction: column;

    .arrowIcon {
        width: 18px;
        height: 26px;
        margin: 24px;
        cursor: pointer;
    }
`;

const Slide = styled.div`
    display: flex;
`;

const SlideInner = styled(motion.div)`
    width: 439px;
    height: 144px;
    position: absolute;
    top: 0;
    left: 0;
`;

const Window = styled.div`
    overflow: hidden;
    width: 439px;
    height: 144px;
    position: relative;
`;

const DotButtonSet = styled.div`
    display: flex;
    gap: 8px;
    margin-left: 66px;
    margin-top: 64px;
`;

const Dot = styled.div<{ isCurrent: boolean }>`
    background: ${(props) =>
        props.isCurrent ? props.theme.color.yellow : props.theme.color.purple};
    border: 1px solid ${({ theme }) => theme.color.whiteT1};
    border-radius: 100%;
    height: 16px;
    width: 16px;
`;
