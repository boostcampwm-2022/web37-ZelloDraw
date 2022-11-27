import { useState, useRef, useEffect, useCallback } from 'react';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PEN_LINE_WIDTH,
    PEN_DEFAULT_COLOR,
    ERASER_COLOR,
    ERASER_LINE_WIDTH,
} from '@utils/constants';
import { useRecoilValue } from 'recoil';
import { quizSubmitState } from '@atoms/game';
import { convertHexToRgba, getPixelColor, isSameColor, setPixel } from '@utils/canvas';

interface Coordinate {
    x: number;
    y: number;
}

function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<any>(null);
    const curColor = useRef<Uint8ClampedArray>(convertHexToRgba('#001D2E'));

    const [pos, setPos] = useState<Coordinate | undefined>({ x: 0, y: 0 });
    const [isPainting, setIsPainting] = useState<boolean>(false);
    const [isFilling, setIsFilling] = useState<boolean>(false);
    const quizSubmitted = useRecoilValue(quizSubmitState);

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

    const onClickPen = (selectedColor: string) => {
        setIsFilling(false);
        setIsPainting(true);
        ctxRef.current.strokeStyle = selectedColor;
        ctxRef.current.lineWidth = PEN_LINE_WIDTH;
    };

    const floodFill = (x: number, y: number, fillColor: Uint8ClampedArray) => {
        const imageData = ctxRef.current.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const visited = new Uint8Array(imageData.width, imageData.height);
        const targetColor = getPixelColor(imageData, x, y);

        if (!isSameColor(targetColor, fillColor)) {
            const stack = [{ x, y }];
            while (stack.length > 0) {
                const child = stack.pop();
                if (!child) return;
                const currentColor = getPixelColor(imageData, child.x, child.y);
                if (
                    !visited[child.y * imageData.width + child.x] &&
                    isSameColor(currentColor, targetColor)
                ) {
                    setPixel(imageData, child.x, child.y, fillColor);
                    visited[child.y * imageData.width + child.x] = 1;
                    stack.push({ x: child.x + 1, y: child.y });
                    stack.push({ x: child.x - 1, y: child.y });
                    stack.push({ x: child.x, y: child.y + 1 });
                    stack.push({ x: child.x, y: child.y - 1 });
                }
            }
            ctxRef.current.putImageData(imageData, 0, 0);
        }
    };

    const paintCanvas = useCallback(
        (event: MouseEvent) => {
            if (isFilling && !isPainting) {
                const curPos = getCoordinates(event);
                if (!curPos) return;
                floodFill(curPos.x, curPos.y, curColor.current);
            }
        },
        [isFilling],
    );

    const onClickPaint = () => {
        setIsFilling(true);
        setIsPainting(false);
    };

    const onColorChange = (color: string) => {
        curColor.current = convertHexToRgba(color);
        ctxRef.current.strokeStyle = color;
        ctxRef.current.lineWidth = PEN_LINE_WIDTH;
    };

    const onClickEraser = () => {
        setIsFilling(false);
        ctxRef.current.strokeStyle = ERASER_COLOR;
        ctxRef.current.lineWidth = ERASER_LINE_WIDTH;
    };

    const onClickReset = () => {
        setIsFilling(false);
        ctxRef.current.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    const onMove = useCallback(
        (event: MouseEvent): void => {
            event.preventDefault();
            event.stopPropagation();

            if (quizSubmitted) return;

            if (isPainting && !isFilling) {
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
        canvas.addEventListener('click', paintCanvas);

        return () => {
            canvas.removeEventListener('mousedown', startPainting);
            canvas.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('mouseup', cancelPainting);
            canvas.removeEventListener('mouseleave', cancelPainting);
            canvas.removeEventListener('mouseleave', paintCanvas);
        };
    }, [onMove, startPainting, cancelPainting, paintCanvas]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d', {
            willReadFrequently: true,
        });
        if (!ctx) return;
        ctx.strokeStyle = PEN_DEFAULT_COLOR;
        ctx.lineWidth = PEN_LINE_WIDTH;
        ctxRef.current = ctx;
    }, []);

    return { canvasRef, onClickPen, onClickPaint, onColorChange, onClickEraser, onClickReset };
}

export default useCanvas;
