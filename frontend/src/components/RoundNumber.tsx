import styled from 'styled-components';

function RoundNumber({ cur, max }: { cur: number; max: number }) {
    return (
        <Round>
            {cur}/{max}
        </Round>
    );
}

export default RoundNumber;

const Round = styled.div`
    height: 45px;
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
