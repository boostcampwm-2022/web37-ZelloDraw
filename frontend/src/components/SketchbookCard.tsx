import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from '@components/Card';
import Timer from '@components/Timer';
import DrawingTools from '@components/DrawingTools';
import { Center } from '@styles/styled';
import { ReactComponent as Sketchbook } from '@assets/sketchbook.svg';
import { getRoundInfo } from '@game/NetworkServiceUtils';
import { roundInfoState, roundInfoType } from '@atoms/game';
import { useRecoilState } from 'recoil';

function SketchbookCard({ onDraw }: { onDraw: boolean }) {
    const [word, setWord] = useState('');
    const [roundInfo, setRoundInfo] = useRecoilState<roundInfoType>(roundInfoState);

    useEffect(() => {
        getRoundInfo()
            .then((roundInfo: roundInfoType) => {
                setRoundInfo(roundInfo);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        console.log('roundInfo', roundInfo);
    }, [roundInfo]);

    return (
        <Card>
            <Container>
                <GameStateSection>
                    <GameTurn>4/8</GameTurn>
                    <Timer />
                </GameStateSection>
                <SketchbookWrapper>
                    <Sketchbook />
                    <Canvas />
                    {onDraw && (
                        <Keyword>
                            <span>{roundInfo.word}</span>
                        </Keyword>
                    )}
                </SketchbookWrapper>
                <DrawingTools onDraw={onDraw} />
            </Container>
        </Card>
    );
}

export default SketchbookCard;

const Container = styled(Center)`
    padding: 44px 38px 0 28px;
`;

const GameStateSection = styled.div`
    display: flex;
    align-items: end;
`;

const GameTurn = styled.div`
    height: 45px;
    margin-right: 32px;
    background: ${({ theme }) => theme.gradation.primaryLightBrown};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-text-stroke: 1px ${({ theme }) => theme.color.blackT1};
    text-stroke: 1px ${({ theme }) => theme.color.blackT1};
    font-family: 'Sniglet', cursive;
    font-weight: 800;
    font-size: 1.75rem;
    letter-spacing: 0.05rem;
    transform: translateY(16px);
`;

const SketchbookWrapper = styled.div`
    position: relative;
    margin: 0 30px;
`;

const Canvas = styled.canvas`
    width: 742px;
    height: 468px;
    position: absolute;
    top: 60px;
    left: 18px;
    border-radius: 40px;
`;

const Keyword = styled.div`
    position: absolute;
    top: 71px;
    left: 50%;
    padding: 2px 8px;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.color.blackT1};
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.color.purple};

    span {
        background: ${({ theme }) => theme.gradation.whitePurple};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        font-size: ${({ theme }) => theme.typo.h4};
    }
`;
