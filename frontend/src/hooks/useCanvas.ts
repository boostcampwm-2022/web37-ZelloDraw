import { useState, useRef, useEffect, useCallback } from 'react';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PEN_LINE_WIDTH,
    PEN_DEFAULT_COLOR,
    ERASER_COLOR,
    ERASER_LINE_WIDTH,
} from '@utils/constants';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    isQuizTypeDrawState,
    quizSubmitState,
    roundNumberState,
    userReplyState,
} from '@atoms/game';

interface Coordinate {
    x: number;
    y: number;
}

function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<any>(null);

    const [pos, setPos] = useState<Coordinate | undefined>({ x: 0, y: 0 });
    const [isPainting, setIsPainting] = useState<boolean>(false);
    const quizSubmitted = useRecoilValue(quizSubmitState);
    const { curRound } = useRecoilValue(roundNumberState);
    const isTypeDraw = useRecoilValue(isQuizTypeDrawState);
    const setUserDrawingReply = useSetRecoilState(userReplyState);

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
        ctxRef.current.strokeStyle = selectedColor;
        ctxRef.current.lineWidth = PEN_LINE_WIDTH;
    };

    const onColorChange = (color: string) => {
        ctxRef.current.strokeStyle = color;
        ctxRef.current.fillStyle = color;
        ctxRef.current.lineWidth = PEN_LINE_WIDTH;
    };

    const onClickEraser = () => {
        ctxRef.current.strokeStyle = ERASER_COLOR;
        ctxRef.current.lineWidth = ERASER_LINE_WIDTH;
    };

    const onClickReset = () => {
        ctxRef.current.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    const onMove = useCallback(
        (event: MouseEvent): void => {
            event.preventDefault();
            event.stopPropagation();

            if (quizSubmitted || curRound === 0) return;

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

        // 유저가 그리는 걸 멈추는 순간 recoil에 그림 저장
        if (isTypeDraw) {
            setUserDrawingReply(canvasRef.current!.toDataURL());
        }
    }, [isTypeDraw]);

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

        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = PEN_DEFAULT_COLOR;
        ctx.lineWidth = PEN_LINE_WIDTH;
        ctxRef.current = ctx;
    }, []);

    useEffect(() => {
        // 라운드가 바뀌면 캔바스 초기화
        ctxRef.current.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, [curRound]);

    return { canvasRef, onClickPen, onColorChange, onClickEraser, onClickReset };
}

export default useCanvas;
