
import { HubConnection } from '@microsoft/signalr';
import React, { useEffect, useRef } from 'react';
import { User } from '../../common/api/apiModels';

interface CanvasProps {
    connection: HubConnection;
    players: User[];
}

const Canvas: React.FunctionComponent<CanvasProps> = ({ connection, players }: CanvasProps): JSX.Element => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const playersRef = useRef<User[]>();
    playersRef.current = players;
    const colors = ["#0000FF", "#00FF00", "#FF0000", "#FF00FF",];

    useEffect(() => {
        const canvas: any = canvasRef.current;
        const context = canvas.getContext('2d');

        // clearCanvas(context);

        drawPlayers(context);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearCanvas = (context: any) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    };

    const drawPlayers = (context: any) => {
        // console.log('draw');
        if (playersRef.current) {
            clearCanvas(context);
            playersRef.current.forEach((player, index) => {
                context.fillStyle = colors[index];
                context.fillRect(player.x, player.y, 15, 15);
            });
            requestAnimationFrame(() => drawPlayers(context));
        }
    };

    return (
        <div style={{ border: '1px solid black', height: 800, width: 800, marginTop: 15 }}>
            <canvas ref={canvasRef} height="800" width="800" />
        </div>
    );
};

export default Canvas;