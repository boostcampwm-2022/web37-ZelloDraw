import { useEffect, useRef, useCallback } from 'react';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { userStreamRefState } from '@atoms/user';
import { useRecoilValue, useRecoilState } from 'recoil';
import { WebRTCUser, userStreamListState } from '@atoms/game';
import { RTCOfferOptions } from '@utils/constants';

function useWebRTC() {
    const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const selfStreamRef = useRecoilValue(userStreamRefState);
    const [userStreamList, setUserStreamList] = useRecoilState<WebRTCUser[]>(userStreamListState);

    const createPeerConnection = useCallback(
        async (
            peerSocketId: string,
            peerName: string,
            audio?: boolean,
            video?: boolean,
        ): Promise<any> => {
            const res = await new Promise((resolve) => {
                try {
                    const pc = new RTCPeerConnection({
                        iceServers: [
                            {
                                urls: [
                                    'stun:stun.l.google.com:19302',
                                    'stun:stun1.l.google.com:19302',
                                    'stun:stun2.l.google.com:19302',
                                    'stun:stun3.l.google.com:19302',
                                    'stun:stun4.l.google.com:19302',
                                ],
                            },
                        ],
                    });

                    pc.onicecandidate = (e) => {
                        if (e.candidate) {
                            NetworkService.emit('webrtc-ice', {
                                ice: e.candidate,
                                candidateReceiveID: peerSocketId,
                            });
                        }
                    };

                    pc.ontrack = (e) => {
                        setUserStreamList((prevList) =>
                            prevList
                                .filter((user) => user.sid !== peerSocketId)
                                .concat({
                                    sid: peerSocketId,
                                    userName: peerName,
                                    stream: e.streams[0],
                                    audio,
                                    video,
                                }),
                        );
                    };

                    if (!selfStreamRef?.current) return;
                    selfStreamRef.current.getTracks().forEach((track) => {
                        if (!selfStreamRef.current) return;
                        pc.addTrack(track, selfStreamRef.current);
                    });
                    resolve(pc);
                } catch (err) {
                    console.log(err);
                    return undefined;
                }
            });
            return res;
        },
        [],
    );

    const createOffers = async (user: WebRTCUser) => {
        const pc = await createPeerConnection(user.sid, user.userName, user.audio, user.video);
        if (!pc) return;
        pcsRef.current = { ...pcsRef.current, [user.sid]: pc };
        try {
            const localSdp = await pc.createOffer(RTCOfferOptions);
            await pc.setLocalDescription(new RTCSessionDescription(localSdp));
            NetworkService.emit('webrtc-offer', {
                sdp: localSdp,
                offerReceiveID: user.sid,
            });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        NetworkService.on(
            'webrtc-offer',
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (
                sdp: RTCSessionDescription,
                offerSendSid: string,
                userName: string,
                audio: boolean,
                video: boolean,
            ) => {
                const pc = await createPeerConnection(offerSendSid, userName, audio, video);
                if (!pc) return;
                pcsRef.current = { ...pcsRef.current, [offerSendSid]: pc };
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                    const localSdp = await pc.createAnswer();
                    await pc.setLocalDescription(new RTCSessionDescription(localSdp));

                    NetworkService.emit('webrtc-answer', {
                        sdp: localSdp,
                        answerReceiveID: offerSendSid,
                    });
                } catch (e) {
                    console.error(e);
                }
            },
        );

        NetworkService.on(
            'webrtc-answer',
            (sdp: RTCSessionDescription, answerSendID: string, userName: string) => {
                const pc: RTCPeerConnection = pcsRef.current[answerSendID];
                if (!pc) return;

                void pc.setRemoteDescription(new RTCSessionDescription(sdp));
            },
        );

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        NetworkService.on('webrtc-ice', async (ice: RTCIceCandidate, iceSendID: string) => {
            const pc: RTCPeerConnection = pcsRef.current[iceSendID];
            if (!pc) return;
            await pc.addIceCandidate(new RTCIceCandidate(ice));
        });

        return () => {
            NetworkService.off('webrtc-offer');
            NetworkService.off('webrtc-answer');
            NetworkService.off('webrtc-ice');
            userStreamList.forEach((user) => {
                if (!pcsRef.current[user.sid]) return;
                pcsRef.current[user.sid].close();
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete pcsRef.current[user.sid];
            });
        };
    }, []);

    return { createOffers };
}

export default useWebRTC;
