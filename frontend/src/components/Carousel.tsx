import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/chevron-left-icon.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/chevron-right-icon.svg';

function Carousel() {
    const [current, setCurrent] = useState<number>(0);
    const [style, setStyle] = useState({
        marginLeft: `-${current}00%`,
    });
    const carouselSize = useRef(4);
    const contents: React.ReactNode[] = [
        <SlideInner>
            <h3>즐거운 시간 보낼 준비가 되었나요?</h3>
            <h3>처음이라면 옆으로 넘겨</h3>
            <h3>도움말을 읽어보세요.</h3>
        </SlideInner>,
        <SlideInner>description 2</SlideInner>,
        <SlideInner>description 3</SlideInner>,
        <SlideInner>description 4</SlideInner>,
    ];

    const moveSlide = (i: number) => {
        let nextIndex = current + i;
        if (nextIndex < 0) nextIndex = carouselSize.current - 1;
        else if (nextIndex >= carouselSize.current) nextIndex = 0;
        setCurrent(nextIndex);
    };

    useEffect(() => {
        setStyle({ marginLeft: `-${current}00%` });
    }, [current]);

    return (
        <CarouselContainer>
            <Slide>
                <LeftArrowIcon className={'arrowIcon'} onClick={() => moveSlide(-1)} />
                <Window>
                    <FlexBox style={style}>
                        {contents.map((elements, i) => (
                            <div key={i}>{elements}</div>
                        ))}
                    </FlexBox>
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

export default Carousel;

const CarouselContainer = styled.div`
    display: flex;
    flex-direction: column;

    .arrowIcon {
        width: 18px;
        height: 26px;
        margin: 24px;
        cursor: pointer;
    }

    div {
        transition: all 0.3s ease-out;
    }
`;

const Slide = styled.div`
    display: flex;
`;

const SlideInner = styled.div`
    width: 439px;
    height: 144px;
`;

const Window = styled.div`
    overflow: hidden;
    width: 439px;
    height: 144px;
`;

const FlexBox = styled.div`
    display: flex;
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
