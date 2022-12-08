import styled from 'styled-components';

interface CurAndMaxNumberType {
    cur: number;
    max: number;
    gradient: 'primaryLightBrown' | 'yellowGreen' | 'whitePurple';
    strokeColor: 'black' | 'blackT1' | 'primaryLight';
}

function CurAndMaxNumber({ cur, max, gradient, strokeColor }: CurAndMaxNumberType) {
    return (
        <CurAndMax gradient={gradient} stroke={strokeColor}>
            {cur}/{max}
        </CurAndMax>
    );
}

export default CurAndMaxNumber;

const CurAndMax = styled.div<{ gradient: string; stroke: string }>`
    height: 45px;
    background: ${(props) => props.theme.gradation[props.gradient]};
    ${({ theme }) => theme.layout.gradientTypo}
    -webkit-text-stroke: 1px ${(props) => props.theme.color[props.stroke]};
    text-stroke: 1px ${(props) => props.theme.color[props.stroke]};
    font-family: 'Sniglet', cursive;
    font-weight: 800;
    font-size: 1.75rem;
    letter-spacing: 0.05rem;
    transform: translateY(16px);
`;
