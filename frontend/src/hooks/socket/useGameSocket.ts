import { useEffect } from 'react';
import { networkServiceInstance as NetworkService } from '@services/socketService';
import { EmitLeaveGameRequest, JoinLobbyReEmitRequest } from '@backend/core/user.dto';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import { gameResultIdState, gameResultState } from '@atoms/result';
import { isRoundTimeoutState, submittedQuizReplyCountState, userListState } from '@atoms/game';
import {
    CompleteGameEmitRequest,
    SubmitQuizReplyEmitRequest,
    SubmitQuizReplyRequest,
} from '@backend/core/game.dto';
import useUserSocket from '@hooks/socket/useUserSocket';

function useGameSocket(setIsCompleteGame: SetterOrUpdater<boolean>) {
    const setGameResult = useSetRecoilState(gameResultState);
    const setGameResultId = useSetRecoilState(gameResultIdState);
    const setUserList = useSetRecoilState(userListState);
    const setSubmittedQuizReplyCount = useSetRecoilState(submittedQuizReplyCountState);
    const setIsRoundTimeout = useSetRecoilState(isRoundTimeoutState);
    const { onSucceedHost, onUpdateUserStream } = useUserSocket();

    useEffect(() => {
        onSucceedHost();
        onUpdateUserStream();

        onCountSubmittedQuiz();
        onRoundTimeout();
        onCompleteGame();
        onLeaveGame();

        return () => {
            NetworkService.off('leave-game');
        };
    }, []);

    function onCountSubmittedQuiz() {
        NetworkService.on(
            'submit-quiz-reply',
            ({ submittedQuizReplyCount }: SubmitQuizReplyEmitRequest) => {
                setSubmittedQuizReplyCount(submittedQuizReplyCount);
            },
        );
    }

    const onRoundTimeout = () => {
        NetworkService.on('round-timeout', () => setIsRoundTimeout(true));
    };

    function onCompleteGame() {
        NetworkService.on('complete-game', (gameResult: CompleteGameEmitRequest) => {
            setGameResultId(gameResult.gameResultId);
            setGameResult(gameResult.quizReplyLists);
            setIsCompleteGame(true);
        });
    }

    function onLeaveGame() {
        NetworkService.on('leave-game', (user: EmitLeaveGameRequest) => {
            setUserList((prev) =>
                prev.filter((participant) => participant.userName !== user.userName),
            );
        });
    }

    const emitSubmitQuizReply = (submitReply: SubmitQuizReplyRequest) => {
        NetworkService.emit('submit-quiz-reply', submitReply);
    };

    return { emitSubmitQuizReply };
}

export default useGameSocket;
