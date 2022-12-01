/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useRef, useState, useCallback } from 'react';
import { getParam } from '@utils/common';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { JoinLobbyReEmitRequest } from '@backend/core/user.dto';
import { userCamState, userMicState } from '@atoms/user';
import { useRecoilValue } from 'recoil';

export interface WebRTCUser {
    sid: string; // socketID
    stream: MediaStream;
}

function useWebRTC() {
    const userCam = useRecoilValue<boolean>(userCamState);
    const userMic = useRecoilValue<boolean>(userMicState);

    const selfVideoRef = useRef<HTMLVideoElement>(null);
    const selfStreamRef = useRef<MediaStream | undefined>();

    const getSelfMedia: () => Promise<void> = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: userCam,
                audio: userMic,
            });
            selfStreamRef.current = stream;

            if (!selfVideoRef.current) return;
            selfVideoRef.current.srcObject = stream;
        } catch (err) {
            console.log(err);
        }
    }, []);

    const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const [userStreamList, setUserStreamList] = useState<WebRTCUser[]>([]);

    const lobbyId = getParam('id');

    const createPeerConnection = useCallback(async (peerSocketId: string): Promise<any> => {
        const res = await new Promise((resolve, reject) => {
            try {
                const pc = new RTCPeerConnection();

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
                                stream: e.streams[0],
                            }),
                    );
                };

                if (!selfStreamRef.current) return;
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
    }, []);

    const createOffers = async (user: JoinLobbyReEmitRequest) => {
        if (!selfStreamRef.current) return;
        const pc = await createPeerConnection(user.sid);
        if (!pc) return;
        pcsRef.current = { ...pcsRef.current, [user.sid]: pc };
        try {
            const localSdp = await pc.createOffer();
            await pc.setLocalDescription(new RTCSessionDescription(localSdp));
            setTimeout(() => {
                NetworkService.emit('webrtc-offer', {
                    sdp: localSdp,
                    offerReceiveID: user.sid,
                });
            }, 2000);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getSelfMedia();

        NetworkService.on(
            'webrtc-offer',
            async (sdp: RTCSessionDescription, offerSendSid: string, userName: string) => {
                if (!selfStreamRef.current) return;
                const pc = await createPeerConnection(offerSendSid);
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

                pc.setRemoteDescription(new RTCSessionDescription(sdp));
            },
        );

        NetworkService.on(
            'webrtc-ice',
            async (ice: RTCIceCandidate, iceSendID: string, userName: string) => {
                const pc: RTCPeerConnection = pcsRef.current[iceSendID];
                if (!pc) return;
                await pc.addIceCandidate(new RTCIceCandidate(ice));
            },
        );

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

    useEffect(() => {
        if (!selfStreamRef.current) return;
        selfStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    }, [userCam]);

    useEffect(() => {
        if (!selfStreamRef.current) return;
        selfStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    }, [userMic]);

    return { selfVideoRef, userStreamList, createOffers };
}

export default useWebRTC;
