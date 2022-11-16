import { useState, useRef, useEffect, useCallback } from 'react';

interface Coordinate {
    x: number;
    y: number;
}

function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pos, setPos] = useState<Coordinate | undefined>({ x: 0, y: 0 });
    const [isPainting, setIsPainting] = useState<boolean>(false);

    const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
        return { x: event.offsetX, y: event.offsetY };
    };

    const drawLine = (prevPos: Coordinate, newPos: Coordinate) => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(prevPos.x, prevPos.y);
        ctx.lineTo(newPos.x, newPos.y);
        ctx.closePath();

        ctx.stroke();
    };

    const onMove = useCallback(
        (event: MouseEvent): void => {
            event.preventDefault(); // drag 방지
            event.stopPropagation(); // drag 방지

            if (isPainting) {
                const newPos = getCoordinates(event);
                if (pos && newPos) {
                    drawLine(pos, newPos);
                    setPos(newPos);
                }
            }
        },
        [isPainting, pos],
    );

    const startPainting = useCallback((event: MouseEvent) => {
        const newPos = getCoordinates(event);
        if (newPos) {
            setIsPainting(true);
            setPos(newPos);
        }
    }, []);

    const cancelPainting = useCallback(() => {
        setIsPainting(false);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;

        canvas.addEventListener('mousedown', startPainting);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', cancelPainting);
        canvas.addEventListener('mouseleave', cancelPainting);

        return () => {
            canvas.removeEventListener('mousedown', startPainting);
            canvas.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('mouseup', cancelPainting);
            canvas.removeEventListener('mouseleave', cancelPainting);
        };
    }, [onMove, startPainting, cancelPainting]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.width = 742;
        canvas.height = 468;
    }, []);

    return canvasRef;
}

export default useCanvas;
