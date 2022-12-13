import { useRecoilValue } from 'recoil';
import { userState } from '@atoms/user';
import { canOneMoreGameState } from '@atoms/result';
import PrimaryButton from '@components/PrimaryButton';

interface OneMoreGameButtonProps {
    isForShareResult: boolean;
    emitOneMoreGame: () => void;
}

function OneMoreGameButton({ isForShareResult, emitOneMoreGame }: OneMoreGameButtonProps) {
    const { isHost } = useRecoilValue(userState);
    const canOneMoreGame = useRecoilValue(canOneMoreGameState);

    function playOneMoreGame() {
        emitOneMoreGame();
    }

    return (
        <>
            {!isForShareResult && canOneMoreGame && isHost && (
                <div onClick={playOneMoreGame} role={'button'} aria-label={'게임 한판 더 하기'}>
                    <PrimaryButton topText='ONE MORE' bottomText='한판 더 하기' />
                </div>
            )}
        </>
    );
}
export default OneMoreGameButton;
