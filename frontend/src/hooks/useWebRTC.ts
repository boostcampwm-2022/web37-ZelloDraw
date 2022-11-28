import { useEffect, useRef } from 'react';
import { getParam } from '@utils/common';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { userMicCamState, userMicCamType } from '@atoms/user';
import { useRecoilState } from 'recoil';

function useWebRTC() {
    const [userMicCam, setUserMicCam] = useRecoilState<userMicCamType>(userMicCamState);

    const selfVideoRef = useRef<HTMLVideoElement>(null);
    const selfStreamRef = useRef<MediaStream | undefined>();
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection>();
    const lobbyId = getParam('id');

    const setMicState = (curState: boolean) => {
        setUserMicCam({ ...userMicCam, isMicOn: curState });
        if (!selfStreamRef.current) return;
        selfStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    };

    const setCamState = (curState: boolean) => {
        setUserMicCam({ ...userMicCam, isCamOn: curState });
        if (!selfStreamRef.current) return;
        selfStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    };

    const getSelfMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: userMicCam.isCamOn,
                audio: userMicCam.isMicOn,
            });
            selfStreamRef.current = stream;

            if (!selfVideoRef.current) return;
            selfVideoRef.current.srcObject = stream;

            selfStreamRef.current.getTracks().forEach((track) => {
                if (!pcRef.current || !selfStreamRef.current) return;
                pcRef.current.addTrack(track, selfStreamRef.current);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const getMedia = () => {
        void getSelfMedia();

        if (!pcRef.current) return;

        pcRef.current.onicecandidate = (e) => {
            if (e.candidate) {
                console.log('recv candidate');
                NetworkService.emit('ice', { ice: e.candidate, lobbyId });
            }
        };

        pcRef.current.ontrack = (e) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = e.streams[0];
            }
        };
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
        console.log('createAnswer');
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

        NetworkService.on('offer', (sdp: RTCSessionDescription) => {
            if (!pcRef.current) return;
            console.log('on offer');
            void createAnswer(sdp);
        });

        NetworkService.on('answer', (sdp: RTCSessionDescription) => {
            if (!pcRef.current) return;
            console.log('on answer');
            void pcRef.current.setRemoteDescription(sdp);
        });

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        NetworkService.on('ice', async (ice: RTCIceCandidate) => {
            if (!pcRef.current) return;
            console.log('on ice');
            await pcRef.current.addIceCandidate(ice);
            console.log(pcRef.current);
        });

        return () => {
            NetworkService.off('offer');
            NetworkService.off('answer');
            NetworkService.off('ice');
            if (pcRef.current) pcRef.current.close();
        };
    }, []);

    return { selfVideoRef, getSelfMedia, setMicState, setCamState, getMedia, createOffer };
}

export default useWebRTC;
function asnyc() {
    throw new Error('Function not implemented.');
}
