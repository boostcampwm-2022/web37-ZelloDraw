import { useEffect, useState } from 'react';
import { onRoundTimeout } from '@game/NetworkServiceUtils';
import { useRecoilValue } from 'recoil';
import { roundNumberState } from '@atoms/game';

function useRoundTimeout() {
    const [isRoundTimeout, setIsRoundTimeout] = useState(false);
    const { curRound } = useRecoilValue(roundNumberState);

    useEffect(() => {
        onRoundTimeout(setIsRoundTimeout);
    }, []);

    useEffect(() => {
        setIsRoundTimeout(false);
    }, [curRound]);

    return { isRoundTimeout };
}

export default useRoundTimeout;
