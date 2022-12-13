import { useState, useRef, useEffect, useCallback } from 'react';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PEN_DEFAULT_LINE_WIDTH,
    PEN_DEFAULT_COLOR,
    ERASER_COLOR,
    CanvasState,
    canvasLineWidthValues,
} from '@utils/constants';
import { convertHexToRgba, getPixelColor, isSameColor, setPixel } from '@utils/canvas';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    canClearCanvasState,
    isQuizTypeDrawState,
    quizSubmitState,
    resetModalOpenState,
    roundNumberState,
    userReplyState,
} from '@atoms/game';
import useSoundEffect from '@hooks/useSoundEffect';
import selectedSound from '@assets/sounds/select-tools.wav';

interface Coordinate {
    x: number;
    y: number;
}

function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<any>(null);
    const curColor = useRef<Uint8ClampedArray>(convertHexToRgba(PEN_DEFAULT_COLOR));
    const drawState = useRef<CanvasState>(CanvasState.NONE);

    const posRef = useRef<Coordinate | undefined>({ x: 0, y: 0 });
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [canClearCanvas, setCanClearCanvas] = useRecoilState(canClearCanvasState);
    const quizSubmitted = useRecoilValue(quizSubmitState);
    const { curRound } = useRecoilValue(roundNumberState);
    const isTypeDraw = useRecoilValue(isQuizTypeDrawState);
    const setUserDrawingReply = useSetRecoilState(userReplyState);
    const setResetModalOpen = useSetRecoilState(resetModalOpenState);

    const { playSoundEffect } = useSoundEffect();

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
        drawState.current = CanvasState.NONE;
        ctxRef.current.strokeStyle = selectedColor;
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
            if (drawState.current === CanvasState.PAINT) {
                const curPos = getCoordinates(event);
                if (!curPos) return;
                floodFill(curPos.x, curPos.y, curColor.current);
            }
        },
        [drawState],
    );

    const onClickPaint = () => {
        drawState.current = CanvasState.PAINT;
    };

    const onLineWidthChange = (index: number) => {
        playSoundEffect(selectedSound);
        ctxRef.current.lineWidth = canvasLineWidthValues[index];
    };

    const onColorChange = (color: string) => {
        playSoundEffect(selectedSound);
        curColor.current = convertHexToRgba(color);
        ctxRef.current.strokeStyle = color;
    };

    const onClickEraser = () => {
        drawState.current = CanvasState.NONE;
        ctxRef.current.strokeStyle = ERASER_COLOR;
    };

    const onClickReset = () => {
        drawState.current = CanvasState.NONE;
        setResetModalOpen(true);
    };

    useEffect(() => {
        // 리셋 모달에서 '지울게요' 버튼을 누르면 캔바스가 초기화된다.
        if (canClearCanvas) {
            clearCanvas();
            setCanClearCanvas(false);
        }
    }, [canClearCanvas]);

    const clearCanvas = () => {
        ctxRef.current.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctxRef.current.fillStyle = ERASER_COLOR;
        ctxRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    const onMove = useCallback(
        (event: MouseEvent): void => {
            event.preventDefault();
            event.stopPropagation();

            if (quizSubmitted || curRound === 0) return;

            if (drawState.current === CanvasState.DRAW && isDrawing) {
                const newPos = getCoordinates(event);
                if (posRef.current && newPos) {
                    drawLine(posRef.current, newPos);
                    posRef.current = newPos;
                }
            }
        },
        [drawState, posRef.current],
    );

    const startPainting = useCallback((event: MouseEvent) => {
        if (drawState.current === CanvasState.PAINT) return;
        const newPos = getCoordinates(event);
        if (newPos) {
            drawState.current = CanvasState.DRAW;
            setIsDrawing(true);
            posRef.current = newPos;
        }
    }, []);

    const cancelPainting = useCallback(() => {
        setIsDrawing(false);

        // 유저가 그리는 걸 멈추는 순간 recoil에 그림 저장
        if (isTypeDraw) {
            if (!canvasRef.current) return;
            setUserDrawingReply(canvasRef.current.toDataURL());
        }
    }, [isTypeDraw]);

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
            canvas.removeEventListener('click', paintCanvas);
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
        ctx.lineWidth = PEN_DEFAULT_LINE_WIDTH;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;
        clearCanvas();
    }, []);

    useEffect(() => {
        // 라운드가 바뀌면 캔바스 초기화
        clearCanvas();
    }, [curRound]);

    return {
        canvasRef,
        onClickPen,
        onClickPaint,
        onColorChange,
        onClickEraser,
        onClickReset,
        onLineWidthChange,
    };
}

export default useCanvas;
