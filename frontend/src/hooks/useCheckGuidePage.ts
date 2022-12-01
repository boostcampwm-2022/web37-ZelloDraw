import { useRecoilValue } from 'recoil';
import { currentPageIdxState, isEndedState, isStartedState } from '@atoms/result';

function useCheckGuidePage() {
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const isEnded = useRecoilValue(isEndedState);
    const isStarted = useRecoilValue(isStartedState);
    const guidePageIdx = -1;

    function checkIsNotGuidePage() {
        return currentPageIdx > guidePageIdx && !isEnded && !isStarted;
    }

    return { checkIsNotGuidePage };
}

export default useCheckGuidePage;
