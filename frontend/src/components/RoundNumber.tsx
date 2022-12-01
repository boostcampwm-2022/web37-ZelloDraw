import styled from 'styled-components';

function RoundNumber({ cur, max, round }: { cur: number; max: number; round: boolean }) {
    return (
        <Round round={round}>
            {cur}/{max}
        </Round>
    );
}

export default RoundNumber;

const Round = styled.div<{ round: boolean }>`
    height: 45px;
    background: ${(props) =>
        props.round ? props.theme.gradation.primaryLightBrown : props.theme.gradation.whitePurple};
    ${({ theme }) => theme.layout.gradientTypo}
    -webkit-text-stroke: 1px ${(props) =>
        props.round ? props.theme.color.blackT1 : props.theme.color.primaryLight};
    text-stroke: 1px
        ${(props) => (props.round ? props.theme.color.blackT1 : props.theme.color.primaryLight)};
    font-family: 'Sniglet', cursive;
    font-weight: 800;
    font-size: 1.75rem;
    letter-spacing: 0.05rem;
    transform: translateY(16px);
`;
