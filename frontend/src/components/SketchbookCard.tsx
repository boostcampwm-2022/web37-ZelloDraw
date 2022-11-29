import { ReactNode } from 'react';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { ReactComponent as SketchbookImg } from '@assets/sketchbook.svg';
import Card from '@components/Card';

interface SketchbookCardType {
    left?: ReactNode;
    center: ReactNode;
    right?: ReactNode;
}

function SketchbookCard({ left, center, right }: SketchbookCardType) {
    return (
        <Card>
            <Container>
                <LeftSide>{left}</LeftSide>
                <SketchbookWrapper>
                    <SketchbookImg />
                    {center}
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
    margin: 0 30px;
`;

const RightSide = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: space-between;
    width: 100px;
    height: 500px;
`;
