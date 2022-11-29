import { useRecoilValue } from 'recoil';
import { roundNumberState } from '@atoms/game';
import RoundNumber from '@components/RoundNumber';
import Timer from '@components/Timer';

function RoundNumberAndTimer() {
    const { curRound, maxRound } = useRecoilValue(roundNumberState);
    return (
        <>
            <RoundNumber cur={curRound} max={maxRound} />
            <Timer />
        </>
    );
}

export default RoundNumberAndTimer;
