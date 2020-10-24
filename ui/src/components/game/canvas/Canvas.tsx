
import { HubConnection } from '@microsoft/signalr';
import React, { useState, useEffect, useRef } from 'react';

interface CanvasProps {
    connection: HubConnection;
    playerState: any;
}

const Canvas: React.FunctionComponent<CanvasProps> = ({ connection, playerState }: CanvasProps): JSX.Element => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas: any = canvasRef.current;
        const context = canvas.getContext('2d');

        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.fillStyle = '#000000';
        context.fillRect(playerState.x, playerState.y, 15, 15);
    }, [playerState]);

    return (
        <div>
            <canvas ref={canvasRef} height="800" width="800" />
        </div>
    );
};

export default Canvas;