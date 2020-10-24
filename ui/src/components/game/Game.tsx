
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../common/constants';
import Canvas from './canvas/Canvas';
import Chat from './chat/Chat';

const Game: React.FunctionComponent = (): JSX.Element => {
    const [connection, setConnection] = useState<HubConnection>();
    const [playerState, setPlayerState] = useState({ user: 'default', x: 0, y: 0 } as any);
    const canvasRef = useRef(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/chat`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then((result: any) => {
                    console.log('Connected!');

                    setupConnectionListeners();
                })
                .catch((e: any) => console.log('Connection failed: ', e));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection]);

    const setupConnectionListeners = () => {

        if (!connection) {
            return;
        }

        connection.on('UpdatePlayerState', (state: any) => {
            console.log(state);

            setPlayerState(state);
        });

        // connection.on('ReceiveMessage', (message: any) => {
        //     const updatedChat = [...latestChat.current];
        //     updatedChat.push(message);

        //     setChat(updatedChat);
        // });

        // connection.on('GetBannerInfo', (bannerInfo: any) => {

        // });
    };

    const moveSquare = async () => {

        if (connection?.state === HubConnectionState.Connected) {
            try {
                await connection?.send('SendPlayerState', playerState);
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    };

    return (
        <div>
            <Canvas connection={connection as any} playerState={playerState} />
            <Chat connection={connection as any} />
            <button onClick={moveSquare} >Move</button>
            <span>Global counter: {playerState.x}</span>
        </div>
    );
};

export default Game;