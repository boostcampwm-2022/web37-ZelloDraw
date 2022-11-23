import { useEffect, useState } from 'react';
import { emitSubmitQuizReply } from '@game/NetworkServiceUtils';
import { useRecoilValue } from 'recoil';
import { quizReplyState } from '@atoms/game';

function useZeroRound(curRound: number) {
    const placeholderDefault = '그림을 보고 답을 맞춰보세요!';
    const quizReplyContent = useRecoilValue(quizReplyState);
    const [placeholder, setPlaceholder] = useState(placeholderDefault);

    useEffect(() => {
        setRandomWordToPlaceholder();
    }, [curRound, quizReplyContent]);

    function setRandomWordToPlaceholder() {
        if (curRound > 1) return;

        // 0번 라운드일 때만 인풋 플레이스홀더에서 유저에게 랜덤 단어를 보여준다.
        if (curRound === 0 && quizReplyContent !== '') {
            setPlaceholder(quizReplyContent);
            return;
        }

        setPlaceholder(placeholderDefault);
    }

    function sendRandomWordReplyToServer() {
        // 0번 라운드일 때, 유저가 출제한 퀴즈의 값이 없을 경우 이전에 받았던 랜덤 단어가 제출된다.
        emitSubmitQuizReply({ quizReply: { type: 'ANSWER', content: quizReplyContent } });
    }

    return { placeholder, sendRandomWordReplyToServer };
}

export default useZeroRound;
