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
import { convertHexToRgba, getPixelColor, getPixelOffset, isSameColor } from '@utils/canvas';

interface Coordinate {
    x: number;
    y: number;
}

function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<any>(null);

    const [pos, setPos] = useState<Coordinate | undefined>({ x: 0, y: 0 });
    const [isPainting, setIsPainting] = useState<boolean>(false);
    const [isFilling, setIsFilling] = useState<boolean>(false);
    const [color, setColor] = useState<Uint8ClampedArray>(convertHexToRgba('#001D2E'));
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

    const setPixel = (imageData: any, x: number, y: number, color: Uint8ClampedArray) => {
        const offset = getPixelOffset(imageData, x, y);
        imageData.data[offset + 0] = color[0];
        imageData.data[offset + 1] = color[1];
        imageData.data[offset + 2] = color[2];
        imageData.data[offset + 3] = color[0];
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
            if (isFilling) {
                const curPos = getCoordinates(event);
                if (!curPos) return;
                floodFill(curPos.y, curPos.x, color);
            }
        },
        [isFilling, pos],
    );

    const onClickPaint = () => {
        setIsFilling(true);
        setIsPainting(false);
    };

    const onColorChange = (color: string) => {
        setColor(convertHexToRgba(color));
        ctxRef.current.strokeStyle = color;
        ctxRef.current.fillStyle = color;
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
        ctx.fillStyle = '#F6F5F8';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, []);

    return { canvasRef, onClickPen, onClickPaint, onColorChange, onClickEraser, onClickReset };
}

export default useCanvas;
