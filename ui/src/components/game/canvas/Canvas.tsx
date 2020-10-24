
import { HubConnection } from '@microsoft/signalr';
import React, { useEffect, useRef } from 'react';
import { User } from '../../common/api/apiModels';

interface CanvasProps {
    connection: HubConnection;
    players: User[];
}

const Canvas: React.FunctionComponent<CanvasProps> = ({ connection, players }: CanvasProps): JSX.Element => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const colors = ["#0000FF", "#00FF00", "#FF0000", "#FF00FF",];

    useEffect(() => {
        const canvas: any = canvasRef.current;
        const context = canvas.getContext('2d');

        clearCanvas(context);

        drawPlayers(context, players);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [players]);

    const clearCanvas = (context: any) => {
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    };

    const drawPlayers = (context: any, players: User[]) => {
        players.forEach((player, index) => {
            context.fillStyle = colors[index];
            context.fillRect(player.x, player.y, 15, 15);
        });
    };

    return (
        <div>
            <canvas ref={canvasRef} height="800" width="800" />
        </div>
    );
};

export default Canvas;