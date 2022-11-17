import { useState, useRef, useEffect, useCallback } from 'react';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PEN_LINE_WIDTH,
    PEN_DEFAULT_COLOR,
} from './../utils/constants';

interface Coordinate {
    x: number;
    y: number;
}

function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<any>(null);

    const [pos, setPos] = useState<Coordinate | undefined>({ x: 0, y: 0 });
    const [isPainting, setIsPainting] = useState<boolean>(false);

    const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
        return { x: event.offsetX, y: event.offsetY };
    };

    const drawLine = (prevPos: Coordinate, newPos: Coordinate) => {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(prevPos.x, prevPos.y);
        ctxRef.current.lineTo(newPos.x, newPos.y);
        ctxRef.current.closePath();
        ctxRef.current.stroke();
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
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = PEN_DEFAULT_COLOR;
        ctx.lineWidth = PEN_LINE_WIDTH;
        ctxRef.current = ctx;
    }, []);

    return [canvasRef, ctxRef];
}

export default useCanvas;
