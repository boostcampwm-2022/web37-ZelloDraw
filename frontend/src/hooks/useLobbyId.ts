import { SetterOrUpdater, useRecoilState } from 'recoil';
import { lobbyIdState } from '@atoms/game';
import { getParam } from '@utils/common';

function useLobbyId(): [string, SetterOrUpdater<string>] {
    const [lobbyId, setLobbyId] = useRecoilState(lobbyIdState);
    const res = getParam('id') === '' ? lobbyId : getParam('id');

    return [res, setLobbyId];
}

export default useLobbyId;
