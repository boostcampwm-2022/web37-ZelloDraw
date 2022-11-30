/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useRef } from 'react';
import { getParam } from '@utils/common';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import useLocalStream from './useLocalStream';

function useWebRTC() {
    const { selfVideoRef, selfStreamRef, getSelfMedia } = useLocalStream();
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection>();
    const lobbyId = getParam('id');

    const getMedia = async () => {
        try {
            await getSelfMedia();

            if (!selfStreamRef.current) return;
            selfStreamRef.current.getTracks().forEach((track) => {
                if (!pcRef.current || !selfStreamRef.current) return;
                pcRef.current.addTrack(track, selfStreamRef.current);
            });

            if (!pcRef.current) return;

            pcRef.current.onicecandidate = (e) => {
                if (e.candidate) {
                    NetworkService.emit('ice', { ice: e.candidate, lobbyId });
                }
            };

            pcRef.current.ontrack = (e) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = e.streams[0];
                }
            };
        } catch (err) {
            console.log(err);
        }
    };

    const createOffer = async () => {
        if (!pcRef.current) return;
        try {
            const offer = await pcRef.current.createOffer();
            void pcRef.current.setLocalDescription(offer);
            NetworkService.emit('offer', { offer, lobbyId });
        } catch (e) {
            console.error(e);
        }
    };

    const createAnswer = async (sdp: RTCSessionDescription) => {
        if (!pcRef.current) return;
        try {
            void pcRef.current.setRemoteDescription(sdp);
            const answerSdp = await pcRef.current.createAnswer();
            void pcRef.current.setLocalDescription(answerSdp);
            NetworkService.emit('answer', { answerSdp, lobbyId });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        pcRef.current = new RTCPeerConnection();

        void getMedia();

        NetworkService.on('offer', (sdp: RTCSessionDescription) => {
            if (!pcRef.current) return;
            void createAnswer(sdp);
        });

        NetworkService.on('answer', (sdp: RTCSessionDescription) => {
            if (!pcRef.current) return;
            void pcRef.current.setRemoteDescription(sdp);
        });

        NetworkService.on('ice', async (ice: RTCIceCandidate) => {
            if (!pcRef.current) return;
            await pcRef.current.addIceCandidate(ice);
        });

        return () => {
            NetworkService.off('offer');
            NetworkService.off('answer');
            NetworkService.off('ice');
            if (pcRef.current) pcRef.current.close();
        };
    }, []);

    return { remoteVideoRef, selfVideoRef, getSelfMedia, getMedia, createOffer };
}

export default useWebRTC;
