import { emitOneMoreGame } from '@game/NetworkServiceUtils';
import { useRecoilValue } from 'recoil';
import { userState } from '@atoms/user';
import { canOneMoreGameState } from '@atoms/result';
import PrimaryButton from '@components/PrimaryButton';

function OneMoreGameButton({ isForShareResult }: { isForShareResult: boolean }) {
    const { isHost } = useRecoilValue(userState);
    const canOneMoreGame = useRecoilValue(canOneMoreGameState);

    return (
        <>
            {!isForShareResult && canOneMoreGame && isHost && (
                <div onClick={emitOneMoreGame} role={'button'} aria-label={'게임 한판 더 하기'}>
                    <PrimaryButton topText='ONE MORE' bottomText='한판 더 하기' />
                </div>
            )}
        </>
    );
}
export default OneMoreGameButton;
