import { useRecoilValue } from 'recoil';
import { currentPageIdxState, isEndedState } from '@atoms/result';

function useCheckGuidePage() {
    const currentPageIdx = useRecoilValue(currentPageIdxState);
    const isEnded = useRecoilValue(isEndedState);
    const guidePageIdx = -1;

    function checkIsNotGuidePage() {
        return currentPageIdx > guidePageIdx && !isEnded;
    }

    return { checkIsNotGuidePage };
}

export default useCheckGuidePage;
