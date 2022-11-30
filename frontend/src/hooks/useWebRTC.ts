/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useRef, useState, useCallback } from 'react';
import { getParam } from '@utils/common';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import useLocalStream from './useLocalStream';
import { JoinLobbyReEmitRequest } from '@backend/core/user.dto';

interface WebRTCUser {
    sid: string; // socket id
    stream: MediaStream;
}

// 지금 들어온사람 -> [{user}]
// 원래 있던사람들 -> {user}

function useWebRTC() {
    const { selfVideoRef, selfStreamRef, getSelfMedia } = useLocalStream();
    // const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const [userStreamList, setUserStreamList] = useState<WebRTCUser[]>([]);

    const lobbyId = getParam('id');

    const createPeerConnection = useCallback((peerSocketId: string) => {
        try {
            const pc = new RTCPeerConnection();

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    NetworkService.emit('ice', {
                        ice: e.candidate,
                        lobbyId,
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
            return pc;
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }, []);

    const createOffers = async (user: JoinLobbyReEmitRequest) => {
        if (!selfStreamRef.current) return;
        const pc = createPeerConnection(user.sid);
        if (!pc) return;
        pcsRef.current = { ...pcsRef.current, [user.sid]: pc };
        try {
            const localSdp = await pc.createOffer();
            console.log('create offer success');
            await pc.setLocalDescription(new RTCSessionDescription(localSdp));
            NetworkService.emit('offer', {
                sdp: localSdp,
                lobbyId,
                offerReceiveID: user.sid,
            });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getSelfMedia();

        NetworkService.on('offer', async (sdp: RTCSessionDescription, offerSendSid: string) => {
            if (!selfStreamRef.current) return;
            const pc = createPeerConnection(offerSendSid);
            if (!pc) return;
            pcsRef.current = { ...pcsRef.current, [offerSendSid]: pc };
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                const localSdp = await pc.createAnswer();
                await pc.setLocalDescription(new RTCSessionDescription(localSdp));
                NetworkService.emit('answer', {
                    sdp: localSdp,
                    answerReceiveID: offerSendSid,
                });
            } catch (e) {
                console.error(e);
            }
        });

        NetworkService.on('answer', (sdp: RTCSessionDescription, answerSendID: string) => {
            const pc: RTCPeerConnection = pcsRef.current[answerSendID];
            if (!pc) return;
            pc.setRemoteDescription(new RTCSessionDescription(sdp));
        });

        NetworkService.on('ice', async (ice: RTCIceCandidate, iceSendID: string) => {
            const pc: RTCPeerConnection = pcsRef.current[iceSendID];
            if (!pc) return;
            await pc.addIceCandidate(new RTCIceCandidate(ice));
        });

        return () => {
            NetworkService.off('offer');
            NetworkService.off('answer');
            NetworkService.off('ice');
            userStreamList.forEach((user) => {
                if (!pcsRef.current[user.sid]) return;
                pcsRef.current[user.sid].close();
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete pcsRef.current[user.sid];
            });
        };
    }, []);

    return { selfVideoRef, userStreamList, createOffers };
}

export default useWebRTC;
