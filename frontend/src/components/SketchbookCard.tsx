import styled from 'styled-components';
import { Center } from '@styles/styled';
import { ReactComponent as Sketchbook } from '@assets/sketchbook.svg';
import { useRecoilValue } from 'recoil';
import { roundDrawState, roundNumberState, roundWordState } from '@atoms/game';
import useCanvas from '@hooks/useCanvas';
import Card from '@components/Card';
import Timer from '@components/Timer';
import DrawingTools from '@components/DrawingTools';

function SketchbookCard() {
    const { canvasRef, ...rest } = useCanvas();
    const isDraw = useRecoilValue(roundDrawState);
    const word = useRecoilValue(roundWordState);
    const roundNum = useRecoilValue(roundNumberState);

    // TODO: 첫라운드 일때만 스케치북에 설명 보여주기

    return (
        <Card>
            <Container>
                <GameStateSection>
                    <GameTurn>{roundNum}/8</GameTurn>
                    <Timer />
                </GameStateSection>
                <SketchbookWrapper>
                    <Sketchbook />
                    <Canvas ref={canvasRef} />
                    {isDraw && (
                        <Keyword>
                            <span>{word}</span>
                        </Keyword>
                    )}
                    {roundNum === 0 && (
                        <FirstRoundGuide>
                            나만의 문장을 만들어 입력해보세요!
                            <br />
                            다른 사람들이 어떤 그림을 그리게 될까요?
                        </FirstRoundGuide>
                    )}
                </SketchbookWrapper>
                <DrawingTools rest={rest} />
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

const FirstRoundGuide = styled(Center)`
    width: 742px;
    height: 420px;
    position: absolute;
    top: 60px;
    left: 18px;
    color: ${({ theme }) => theme.color.primaryLight};
    font-size: ${({ theme }) => theme.typo.h3};
    font-weight: 600;
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
