import { VOLUME_DETECT_INTERVAL } from '@utils/constants';
import { RefObject } from 'react';

function useDetectSelfAudioVolume() {
    const highlightUserVideo = (stream: MediaStream, videoRef: RefObject<HTMLVideoElement>) => {
        try {
            // Create and configure the audio pipeline
            const audioContext = new AudioContext();
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 512;
            analyzer.smoothingTimeConstant = 0.1;
            const sourceNode = audioContext.createMediaStreamSource(stream);
            sourceNode.connect(analyzer);

            // Analyze the sound
            const interval = setInterval(() => {
                const fftBins = new Float32Array(analyzer.frequencyBinCount);
                analyzer.getFloatFrequencyData(fftBins);

                const frequencyRangeData = new Uint8Array(analyzer.frequencyBinCount);
                analyzer.getByteFrequencyData(frequencyRangeData);
                const sum = frequencyRangeData.reduce((p, c) => p + c, 0);

                const audioMeter = sum / frequencyRangeData.length;
                if (Math.round(audioMeter) > 20) {
                    videoRef.current?.classList.add('speaking');
                } else {
                    videoRef.current?.classList.remove('speaking');
                }
            }, VOLUME_DETECT_INTERVAL);
            return interval;
        } catch (err) {
            //
        }
    };

    return { highlightUserVideo };
}

export default useDetectSelfAudioVolume;
